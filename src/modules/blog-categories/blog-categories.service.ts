import { Request } from 'express';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { IPagination } from 'src/common/data-query/pagination.interface';

import { BlogCategory } from './entities/blog-category.entity';
import {
  BlogCategoryResponseDto,
  CreateBlogCategoryDto,
} from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { GetBlogCategoryDto } from './dto/get-blog-category.dto';

@Injectable()
export class BlogCategoriesService {
  constructor(
    @InjectRepository(BlogCategory)
    private readonly blogCategoryRepository: Repository<BlogCategory>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  // ---------------- CREATE ----------------
  async create(
    req: Request,
    createBlogCategoryDto: CreateBlogCategoryDto,
  ): Promise<BlogCategoryResponseDto> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException(
        'Authentication required. You must be signed in to create a blog category.',
      );
    }

    const categoryName = createBlogCategoryDto.name.trim();

    // PERFORMANCE: using exists instead of findOne
    const isExisting = await this.blogCategoryRepository.exists({
      where: { name: categoryName },
      withDeleted: true,
    });

    if (isExisting) {
      throw new BadRequestException(
        `Blog category "${categoryName}" already exists.`,
      );
    }

    const newBlogCategory = this.blogCategoryRepository.create({
      ...createBlogCategoryDto,
      name: categoryName,
      added_by: userId,
    });

    return await this.blogCategoryRepository.save(newBlogCategory);
  }

  // ---------------- FIND ALL ----------------
  async findAll(
    query: GetBlogCategoryDto,
  ): Promise<IPagination<Partial<BlogCategoryResponseDto>>> {
    return this.dataQueryService.execute<Partial<BlogCategoryResponseDto>>({
      repository: this.blogCategoryRepository,
      alias: 'blogCategory',
      pagination: query,
      searchableFields: ['name'],
      select: ['id', 'name', 'created_at', 'updated_at'],
      relations: ['addedBy'],
    });
  }

  // ---------------- FIND ONE ----------------
  async findOne(id: string): Promise<BlogCategoryResponseDto> {
    const blogCategory = await this.blogCategoryRepository.findOne({
      where: { id },
    });

    if (!blogCategory) {
      throw new BadRequestException('Blog category not found');
    }

    return blogCategory;
  }

  // ---------------- UPDATE ----------------
  async update(
    id: string,
    updateBlogCategoryDto: UpdateBlogCategoryDto,
  ): Promise<BlogCategoryResponseDto> {
    const blogCategory = await this.findOne(id);

    if (updateBlogCategoryDto.name) {
      const trimmedName = updateBlogCategoryDto.name.trim();

      const isNameTaken = await this.blogCategoryRepository.exists({
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

      blogCategory.name = trimmedName;
    }

    Object.assign(blogCategory, updateBlogCategoryDto);
    return await this.blogCategoryRepository.save(blogCategory);
  }

  // ---------------- DELETE (SOFT) ----------------
  async remove(id: string): Promise<void> {
    const result = await this.blogCategoryRepository.softDelete(id);

    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: Record might already be removed.',
      );
    }
  }
}
