import { Request } from 'express';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreatePricingCategoryDto,
  PricingCategoryResponseDto,
} from './dto/create-pricing-category.dto';
import { UpdatePricingCategoryDto } from './dto/update-pricing-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PricingCategory } from './entities/pricing-category.entity';
import { Not, Repository } from 'typeorm';
import { GetPricingCategoryDto } from './dto/get-pricing-category.dto';
import { IPagination } from 'src/common/data-query/pagination.interface';

@Injectable()
export class PricingCategoryService {
  constructor(
    @InjectRepository(PricingCategory)
    private readonly pricingCategoryRepository: Repository<PricingCategory>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  async create(
    req: Request,
    createPricingCategoryDto: CreatePricingCategoryDto,
  ): Promise<PricingCategoryResponseDto> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException(
        'Authentication required. You must be signed in to create this record.',
      );
    }

    const title = createPricingCategoryDto.title.trim();

    // Check if title already exists
    const isExisting = await this.pricingCategoryRepository.exists({
      where: { title },
      withDeleted: true,
    });

    if (isExisting) {
      throw new BadRequestException(
        `Pricing Category "${title}" already exists.`,
      );
    }

    const newCategory = this.pricingCategoryRepository.create({
      ...createPricingCategoryDto,
      title,
      added_by: userId,
    });

    return await this.pricingCategoryRepository.save(newCategory);
  }

  async findAll(
    query: GetPricingCategoryDto,
  ): Promise<IPagination<Partial<PricingCategoryResponseDto>>> {
    return this.dataQueryService.execute<Partial<PricingCategoryResponseDto>>({
      repository: this.pricingCategoryRepository,
      alias: 'pricingCategory',
      pagination: query,
      searchableFields: ['title'],
      select: [
        'id',
        'title',
        'description',
        'is_active',
        'created_at',
        'updated_at',
      ],
      relations: ['addedBy'],
    
    });
  }

  async findOne(id: string): Promise<PricingCategoryResponseDto> {
    const category = await this.pricingCategoryRepository.findOne({
      where: { id },
    
    });

    if (!category) {
      throw new BadRequestException('Pricing Category not found.');
    }

    return category;
  }

  async update(
    id: string,
    updatePricingCategoryDto: UpdatePricingCategoryDto,
  ): Promise<PricingCategoryResponseDto> {
    const category = await this.findOne(id);

    if (updatePricingCategoryDto.title) {
      const trimmedTitle = updatePricingCategoryDto.title.trim();

      // Check for unique title
      const isTitleTaken = await this.pricingCategoryRepository.exists({
        where: { title: trimmedTitle, id: Not(id) },
        withDeleted: true,
      });

      if (isTitleTaken) {
        throw new BadRequestException(
          `Title "${trimmedTitle}" is already in use.`,
        );
      }

      category.title = trimmedTitle;
    }

    Object.assign(category, updatePricingCategoryDto);
    return await this.pricingCategoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const result = await this.pricingCategoryRepository.softDelete(id);

    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: Record might already be removed.',
      );
    }
  }
}
