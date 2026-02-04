import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { AssigenPricingFeature } from './entities/assigen-pricing-feature.entity';
import {
  AssignPricingFeatureResponseDto,
  CreateAssigenPricingFeatureDto,
} from './dto/create-assigen-pricing-feature.dto';
import { UpdateAssigenPricingFeatureDto } from './dto/update-assigen-pricing-feature.dto';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { GetAssignPricingFeatureDto } from './dto/get-assigen-pricing-feature.dto';
import { Request } from 'express';
// import { AssignPricingFeatureResponseDto } from './dto/assigen-pricing-feature-response.dto';

@Injectable()
export class AssigenPricingFeaturesService {
  constructor(
    @InjectRepository(AssigenPricingFeature)
    private readonly assigenRepo: Repository<AssigenPricingFeature>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /** Create a new assign pricing feature */
 async create(
  req: Request,
  createDto: CreateAssigenPricingFeatureDto,
): Promise<AssigenPricingFeature> {
  const userId = req?.user?.sub;

  if (!userId) {
    throw new UnauthorizedException(
      'Authentication required. You must be signed in to create this record.',
    );
  }

  // Prevent duplicate assignment
  const exists = await this.assigenRepo.findOne({
    where: {
      pricing_id: createDto.pricing_id,
      pricing_features_id: createDto.pricing_features_id,
    },
  });

  if (exists) {
    throw new BadRequestException(
      'This pricing feature is already assigned to the pricing.',
    );
  }

  // FIXED LOGIC HERE:
  const entity = this.assigenRepo.create({
    ...createDto,
    pricing_id: createDto.pricing_id,
    pricing_features_id: createDto.pricing_features_id, // Use the correct DTO field
    added_by: userId,
  });

  return this.assigenRepo.save(entity);
}

  /** Get all assigned pricing features with optional filters and pagination */

  async findAll(query: GetAssignPricingFeatureDto) {
  const assigendPricing = this.assigenRepo.createQueryBuilder('assigen');

  assigendPricing
    .leftJoin('assigen.pricing', 'pricing')
    .leftJoin('pricing.pricingCategory', 'pricingCategory')
    .addSelect([
      'assigen.id',
      'assigen.added_by',
      'assigen.created_at',
      'assigen.updated_at',
      'pricing.id', 
      'pricingCategory.id',
      'pricingCategory.title',
    ])
    .leftJoin('assigen.pricing_feature', 'pricing_feature')
    .addSelect([
      'pricing_feature.id',
      'pricing_feature.title'
    ])
    .leftJoin('assigen.addedBy', 'addedBy')
    .addSelect([
      'addedBy.id',
      'addedBy.name',
      'addedBy.email',
      'addedBy.mobile',
    ])
    .orderBy('assigen.id', 'DESC');

  return await assigendPricing.getMany();
}

  /** Get a single assigned pricing feature by UUID */
async findOne(id: string) {
  const query = this.assigenRepo.createQueryBuilder('assigen')
    .leftJoin('assigen.pricing', 'pricing')
    .leftJoin('pricing.pricingCategory', 'pricingCategory')
    .leftJoin('assigen.pricing_feature', 'pricing_feature')
    .leftJoin('assigen.addedBy', 'addedBy')
    .select([
      'assigen.id',
      'assigen.pricing_id',
      'assigen.pricing_features_id',
      'assigen.created_at',
      'assigen.updated_at',
      'pricing.id',
      'pricing.service_id',
      'pricing.pricing_category_id',
      'pricingCategory.id',
      'pricingCategory.title',
      'pricing_feature.id',
      'pricing_feature.title',
      'addedBy.id',
      'addedBy.name',
      'addedBy.email',
      'addedBy.mobile',
    ])
    .where('assigen.id = :id', { id });

  const entity = await query.getOne();

  if (!entity) {
    throw new NotFoundException('Assigned pricing feature not found.');
  }

  return entity;
}

  /** Update an assigned pricing feature */
/** Update an assigned pricing feature */
  async update(
    id: string,
    updateDto: UpdateAssigenPricingFeatureDto,
  ): Promise<any> {
    // 1. Check if the record exists
    const entity = await this.assigenRepo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException('Assigned pricing feature not found.');
    }
    // 2. Prevent duplicate assignment
    if (updateDto.pricing_id || updateDto.pricing_features_id) {
      const duplicate = await this.assigenRepo.findOne({
        where: {
          id: Not(id),
          pricing_id: updateDto.pricing_id ?? entity.pricing_id,
          pricing_features_id:
            updateDto.pricing_features_id ?? entity.pricing_features_id,
        },
      });
      if (duplicate) {
        throw new BadRequestException(
          'This pricing feature is already assigned to the pricing.',
        );
      }
    }

    // 3. Merge changes and Save
    Object.assign(entity, updateDto);
    await this.assigenRepo.save(entity);

    // 4. Return the formatted data using your existing findOne logic
    return this.findOne(id);
  }

  /** Soft delete an assigned pricing feature */
  async remove(id: string): Promise<void> {
    const entity = await this.assigenRepo.findOne({ where: { id } });
    if (!entity)
      throw new NotFoundException('Assigned pricing feature not found.');

    const result = await this.assigenRepo.softDelete(id);
    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: record might already be removed.',
      );
    }
  }
}


  
