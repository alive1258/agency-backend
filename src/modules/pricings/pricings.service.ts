import { Request } from 'express';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CreatePricingDto, PricingResponseDto } from './dto/create-pricing.dto';
import { UpdatePricingDto } from './dto/update-pricing.dto';
import { Pricing } from './entities/pricing.entity';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { GetPricingDto } from './dto/get-pricing.dto';

@Injectable()
export class PricingsService {
  constructor(
    @InjectRepository(Pricing)
    private readonly pricingRepository: Repository<Pricing>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  // Create new pricing
  async create(
    req: Request,
    createPricingDto: CreatePricingDto,
  ): Promise<PricingResponseDto> {
    const userId = req?.user?.sub;
    if (!userId) throw new UnauthorizedException('Authentication required.');

    // Trim IDs
    createPricingDto.service_id = createPricingDto.service_id.trim();
    createPricingDto.pricing_category_id =
      createPricingDto.pricing_category_id.trim();

    // Check for duplicate combination (including billing_cycle)
    const exists = await this.pricingRepository.exists({
      where: {
        service_id: createPricingDto.service_id,
        pricing_category_id: createPricingDto.pricing_category_id,
        billing_cycle: createPricingDto.billing_cycle,
      },
      withDeleted: true,
    });

    if (exists) {
      throw new BadRequestException('This pricing combination already exists.');
    }

    // Normalize numbers
    const newPricing = this.pricingRepository.create({
      ...createPricingDto,
      added_by: String(userId),
      price: Number(createPricingDto.price),
      discount:
        createPricingDto.discount !== undefined
          ? Number(createPricingDto.discount)
          : undefined,
    });

    return await this.pricingRepository.save(newPricing);
  }

  async findAll(
    query: GetPricingDto,
  ): Promise<IPagination<PricingResponseDto>> {
    const result = await this.dataQueryService.execute<Pricing>({
      repository: this.pricingRepository,
      alias: 'pricing',
      pagination: query,
      relations: ['service', 'pricingCategory', 'addedBy'],
      searchableFields: ['service.name', 'pricingCategory.title'],
    });

    if (!result.data.length) {
      throw new NotFoundException('No pricing records found.');
    }

    const transformed = result.data.map((item) => ({
      id: item.id,
      service_id: item.service_id,
      pricing_category_id: item.pricing_category_id,
      price: Number(item.price),
      discount: Number(item.discount),
      billing_cycle: item.billing_cycle,
      is_active: item.is_active,
      created_at: item.created_at,
      updated_at: item.updated_at,

      service: item.service && {
        id: item.service.id,
        name: item.service.name,
      },

      pricingCategory: item.pricingCategory && {
        id: item.pricingCategory.id,
        title: item.pricingCategory.title,
      },

      addedBy: item.addedBy && {
        id: item.addedBy.id,
        name: item.addedBy.name,
        role: item.addedBy.role,
      },
    }));

    return { ...result, data: transformed };
  }

  async findPricingDetails(id: string) {
    const pricingdPricing =
      this.pricingRepository.createQueryBuilder('pricing');

    pricingdPricing
      // .leftJoinAndSelect(
      //   'pricing.assigen_pricing_feature',
      //   'assigen_pricing_feature',
      // )

      .leftJoinAndSelect(
  'pricing.assigen_pricing_feature',
  'assigen_pricing_feature',
)
      .leftJoinAndSelect('pricing.pricingCategory', 'pricingCategory')
      // .addSelect([
      //   'pricingCategory.id',
      //   'pricingCategory.title',
      //   'pricingCategory.description',
      //   'pricingCategory.is_active',
      // ])
      .leftJoinAndSelect('assigen_pricing_feature.pricing_feature', 'pricing_feature')
      // .addSelect([
      //   'pricing_feature.id',
      //   'pricing_feature.title',
      //   'pricing_feature.is_active',
      // ])
      .leftJoin('pricing.addedBy', 'addedBy')
      .addSelect([
        'addedBy.id',
        'addedBy.name',
        'addedBy.mobile',
        'addedBy.email',
      ])
      .where('pricing.service_id = :id', { id });

    return await pricingdPricing.getMany();
  }

  // Get single pricing
  async findOne(id: string): Promise<PricingResponseDto> {
    const pricing = await this.pricingRepository.findOne({
      where: { id },
      relations: ['service', 'pricingCategory', 'addedBy'],
    });

    if (!pricing) throw new BadRequestException('Pricing not found.');

    return {
      id: pricing.id,
      service_id: pricing.service_id,
      pricing_category_id: pricing.pricing_category_id,
      price: Number(pricing.price),
      discount:
        pricing.discount !== undefined ? Number(pricing.discount) : undefined,
      billing_cycle: pricing.billing_cycle,
      is_active: pricing.is_active,
      created_at: pricing.created_at,
      updated_at: pricing.updated_at,
      deleted_at: pricing.deleted_at,
      addedBy: pricing.addedBy
        ? {
            id: pricing.addedBy.id,
            name: pricing.addedBy.name,
            role: pricing.addedBy.role,
          }
        : undefined,
      service: pricing.service
        ? { id: pricing.service.id, name: pricing.service.name }
        : undefined,
      pricingCategory: pricing.pricingCategory
        ? {
            id: pricing.pricingCategory.id,
            title: pricing.pricingCategory.title,
          }
        : undefined,
    };
  }

  // Update pricing
  async update(
    id: string,
    updatePricingDto: UpdatePricingDto,
  ): Promise<PricingResponseDto> {
    const pricing = await this.findOne(id);

    // Trim IDs if updated
    if (updatePricingDto.service_id)
      updatePricingDto.service_id = updatePricingDto.service_id.trim();
    if (updatePricingDto.pricing_category_id)
      updatePricingDto.pricing_category_id =
        updatePricingDto.pricing_category_id.trim();

    // Normalize numbers
    if (updatePricingDto.price !== undefined)
      updatePricingDto.price = Number(updatePricingDto.price);
    if (updatePricingDto.discount !== undefined)
      updatePricingDto.discount = Number(updatePricingDto.discount);

    // Check for duplicate combination if any key is updated
    if (
      updatePricingDto.service_id ||
      updatePricingDto.pricing_category_id ||
      updatePricingDto.billing_cycle
    ) {
      const exists = await this.pricingRepository.exists({
        where: {
          service_id: updatePricingDto.service_id ?? pricing.service_id,
          pricing_category_id:
            updatePricingDto.pricing_category_id ?? pricing.pricing_category_id,

          billing_cycle:
            updatePricingDto.billing_cycle ?? pricing.billing_cycle,
          id: Not(id),
        },
        withDeleted: true,
      });

      if (exists)
        throw new BadRequestException(
          'This pricing combination already exists.',
        );
    }

    Object.assign(pricing, updatePricingDto);
    return await this.pricingRepository.save(pricing);
  }

  // Soft delete pricing
  async remove(id: string): Promise<void> {
    const result = await this.pricingRepository.softDelete(id);
    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: Record might already be removed.',
      );
    }
  }
}
