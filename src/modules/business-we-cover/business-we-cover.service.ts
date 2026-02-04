import { Request } from 'express';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateBusinessWeCoverDto,
  BusinessWeCoverResponseDto,
} from './dto/create-business-we-cover.dto';
import { UpdateBusinessWeCoverDto } from './dto/update-business-we-cover.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessWeCover } from './entities/business-we-cover.entity';
import { Not, Repository } from 'typeorm';
import { GetBusinessWeCoverDto } from './dto/get-business-we-cover.dto';
import { IPagination } from 'src/common/data-query/pagination.interface';

@Injectable()
export class BusinessWeCoverService {
  constructor(
    @InjectRepository(BusinessWeCover)
    private readonly businessWeCoverRepository: Repository<BusinessWeCover>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create a new business category
   */
  async create(
    req: Request,
    createBusinessWeCoverDto: CreateBusinessWeCoverDto,
  ): Promise<BusinessWeCoverResponseDto> {
    const userId = req?.user?.sub;
    if (!userId) {
      throw new UnauthorizedException(
        'Authentication required. You must be signed in to create this business category.',
      );
    }

    const name = createBusinessWeCoverDto.name.trim();

    // Check if the name already exists (including soft-deleted)
    const exists = await this.businessWeCoverRepository.exists({
      where: { name },
      withDeleted: true,
    });

    if (exists) {
      throw new BadRequestException(
        `Business category "${name}" already exists.`,
      );
    }

    const newEntity = this.businessWeCoverRepository.create({
      ...createBusinessWeCoverDto,
      name,
      added_by: userId,
       service_id: String(createBusinessWeCoverDto.service_id),
    });

    return await this.businessWeCoverRepository.save(newEntity);
  }

  /**
   * Get all business categories with pagination and search
   */
  // public async findAll(
  //   query: GetBusinessWeCoverDto,
  // ): Promise<IPagination<Partial<BusinessWeCoverResponseDto>>> {
  //   return this.dataQueryService.execute<Partial<BusinessWeCoverResponseDto>>({
  //     repository: this.businessWeCoverRepository,
  //     alias: 'business_we_cover',
  //     pagination: query,
  //     searchableFields: ['name'],
  //     relations: ['service', 'addedBy'],
  //     // select: ['id', 'name', 'created_at', 'updated_at'],
  //   });
  // }
async findAll(query: GetBusinessWeCoverDto) {
  const assigendPricing = this.businessWeCoverRepository.createQueryBuilder('assigen');

  assigendPricing
    // 1. Select main table fields (including foreign keys)
    .select([
      'assigen.id',
      'assigen.name',
      'assigen.service_id', // Important for mapping
      'assigen.added_by',   // Important for mapping
      'assigen.is_active',
      'assigen.created_at',
      'assigen.updated_at',
    ])
    // 2. Join and Select Service (id and name)
    .leftJoin('assigen.service', 'service')
    .addSelect([
      'service.id', 
      'service.name'
    ])
    // 3. Join and Select AddedBy (id, name, role)
    .leftJoin('assigen.addedBy', 'addedBy')
    .addSelect([
      'addedBy.id',

    ])
    .orderBy('assigen.created_at', 'DESC');

  return await assigendPricing.getMany();
}


  /**
   * Get single business category by ID
   */
async findOne(id: string): Promise<BusinessWeCoverResponseDto> {
  const entity = await this.businessWeCoverRepository.findOne({
    where: { id },
    relations: ['service', 'addedBy'],
    select: {
      id: true,
      name: true,
      service_id: true,
      added_by: true,
      is_active: true,
      created_at: true,
      updated_at: true,
      // Select specific fields for Service
      service: {
        id: true,
        name: true,
      },
      // Select specific fields for AddedBy
      addedBy: {
        id: true,
        name: true,
        
      },
    },
  });

  if (!entity) {
    throw new BadRequestException('Business category not found.');
  }

  return entity as unknown as BusinessWeCoverResponseDto;
}

  /**
   * Update business category
   */
  async update(
    id: string,
    updateDto: UpdateBusinessWeCoverDto,
  ): Promise<BusinessWeCoverResponseDto> {
    const entity = await this.findOne(id);

    if (updateDto.name) {
      const trimmedName = updateDto.name.trim();

      // Check industry-standard uniqueness
      const nameTaken = await this.businessWeCoverRepository.exists({
        where: { name: trimmedName, id: Not(id) },
        withDeleted: true,
      });

      if (nameTaken) {
        throw new BadRequestException(
          `Business category name "${trimmedName}" is already in use.`,
        );
      }

      entity.name = trimmedName;
    }

    Object.assign(entity, updateDto);

    return await this.businessWeCoverRepository.save(entity);
  }

  /**
   * Soft-delete business category
   */
  async remove(id: string): Promise<void> {
    const result = await this.businessWeCoverRepository.softDelete(id);

    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: Record may already be removed.',
      );
    }
  }
}
