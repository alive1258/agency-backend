import { Request } from 'express';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CategoryResponseDto,
  CreateCategoryDto,
} from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Not, Repository } from 'typeorm';
import { GetCategoryDto } from './dto/get-category.dto';
import { IPagination } from 'src/common/data-query/pagination.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  async create(
    req: Request,
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const userId = req?.user?.sub;
    if (!userId) {
      throw new UnauthorizedException(
        'Authentication required.You must be signed in to create this catagory.',
      );
    }
    const categoryName = createCategoryDto.name.trim();
    // PERFORMANCE: 'findOne' এর বদলে 'exists' ব্যবহার করা হয়েছে
    const isExisting = await this.categoryRepository.exists({
      where: { name: categoryName },
      withDeleted: true,
    });

    if (isExisting) {
      throw new BadRequestException(
        `Category "${categoryName}" already exists.`,
      );
    }
    //3. Create a new category
    const newCategory = this.categoryRepository.create({
      ...createCategoryDto,
      name: categoryName,
      added_by: userId,
    });

    return await this.categoryRepository.save(newCategory);
  }

  public async findAll(
    query: GetCategoryDto,
  ): Promise<IPagination<Partial<CategoryResponseDto>>> {
    return this.dataQueryService.execute<Partial<CategoryResponseDto>>({
      repository: this.categoryRepository,
      alias: 'category',
      pagination: query,
      searchableFields: ['name'],
      select: ['id', 'name', 'created_at', 'updated_at'],
      relations: ['addedBy'],
    });
  }

//   const result = await this.dataQueryService.execute<PricingResponseDto>({
//   repository: this.pricingRepository,
//   alias: 'pricing',
//   pagination: query,
//   searchableFields: [
//     'service.name',
//     'pricingCategory.title',
//     'pricingFeature.title',
//   ],
//   filterableFields: ['is_active', 'deleted_at'],
//   relations: ['service', 'pricingCategory', 'pricingFeature', 'addedBy'],
//   select: [
//     'id',
//     'service_id',
//     'pricing_category_id',
//     'pricing_feature_id',
//     'price',
//     'discount',
//     'billing_cycle',
//     'is_active',
//     'created_at',
//     'updated_at',
//     'deleted_at',
//   ],
//   selectRelations: [
//     'service.id',
//     'service.name',
//     'pricingCategory.id',
//     'pricingCategory.title',
//     'pricingFeature.id',
//     'pricingFeature.title',
//     'addedBy.id',
//     'addedBy.name',
//     'addedBy.role',
//   ],
// });


  async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      
    });
    if (!category) {
      throw new BadRequestException('Category  not found');
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.findOne(id);

    if (updateCategoryDto.name) {
      const trimmedName = updateCategoryDto.name.trim();

      // The Industry Standard check
      const isNameTaken = await this.categoryRepository.exists({
        where: {
          name: trimmedName,
          id: Not(id),
        },
        withDeleted: true,
      });

      if (isNameTaken) {
        throw new BadRequestException(
          `The name "${trimmedName}" is already in use.`,
        );
      }

      category.name = trimmedName;
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

async remove(id: string): Promise<void> {
  const result = await this.categoryRepository.softDelete(id);

  if (!result.affected) {
    throw new BadRequestException(
      'Delete failed: Record might already be removed.',
    );
  }
}

}
