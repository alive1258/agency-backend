import { Request } from 'express';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreatePricingFeatureDto,
  PricingFeatureResponseDto,
} from './dto/create-pricing-feature.dto';
import { UpdatePricingFeatureDto } from './dto/update-pricing-feature.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PricingFeature } from './entities/pricing-feature.entity';
import { Not, Repository } from 'typeorm';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { GetPricingFeaturesDto } from './dto/get-pricing-feature.dto';

@Injectable()
export class PricingFeaturesService {
  constructor(
    @InjectRepository(PricingFeature)
    private readonly pricingFeatureRepository: Repository<PricingFeature>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  async create(
    req: Request,
    createPricingFeatureDto: CreatePricingFeatureDto,
  ): Promise<PricingFeatureResponseDto> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException(
        'Authentication required. You must be signed in to create this record.',
      );
    }

    const title = createPricingFeatureDto.title.trim();

    // Check if the title already exists
    const isExisting = await this.pricingFeatureRepository.exists({
      where: { title },
      withDeleted: true,
    });

    if (isExisting) {
      throw new BadRequestException(
        `Pricing Feature "${title}" already exists.`,
      );
    }

    const newFeature = this.pricingFeatureRepository.create({
      ...createPricingFeatureDto,
      title,
      added_by: userId,
    });

    return await this.pricingFeatureRepository.save(newFeature);
  }

  async findAll(
    query: GetPricingFeaturesDto,
  ): Promise<IPagination<Partial<PricingFeatureResponseDto>>> {
    return this.dataQueryService.execute<Partial<PricingFeatureResponseDto>>({
      repository: this.pricingFeatureRepository,
      alias: 'pricingFeature',
      pagination: query,
      searchableFields: ['title'],
      select: ['id', 'title', 'is_active', 'created_at', 'updated_at'],
      relations: ['addedBy'],
      
    });
  }

  async findOne(id: string): Promise<PricingFeatureResponseDto> {
    const feature = await this.pricingFeatureRepository.findOne({
      where: { id },
      
    });

    if (!feature) {
      throw new BadRequestException('Pricing Feature not found.');
    }

    return feature;
  }

  async update(
    id: string,
    updatePricingFeatureDto: UpdatePricingFeatureDto,
  ): Promise<PricingFeatureResponseDto> {
    const feature = await this.findOne(id);

    if (updatePricingFeatureDto.title) {
      const trimmedTitle = updatePricingFeatureDto.title.trim();

      // Check for unique title
      const isTitleTaken = await this.pricingFeatureRepository.exists({
        where: { title: trimmedTitle, id: Not(id) },
        withDeleted: true,
      });

      if (isTitleTaken) {
        throw new BadRequestException(
          `Title "${trimmedTitle}" is already in use.`,
        );
      }

      feature.title = trimmedTitle;
    }

    Object.assign(feature, updatePricingFeatureDto);
    return await this.pricingFeatureRepository.save(feature);
  }

  async remove(id: string): Promise<void> {
    const result = await this.pricingFeatureRepository.softDelete(id);

    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: Record might already be removed.',
      );
    }
  }
}
