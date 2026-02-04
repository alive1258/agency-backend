import { Request } from 'express';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';

import { PortfolioCategory } from './entities/portfolio-category.entity';
import { CreatePortfolioCategoryDto } from './dto/create-portfolio-category.dto';
import { UpdatePortfolioCategoryDto } from './dto/update-portfolio-category.dto';

@Injectable()
export class PortfolioCategoriesService {
  constructor(
    @InjectRepository(PortfolioCategory)
    private readonly portfolioCategoryRepository: Repository<PortfolioCategory>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  // ---------------- CREATE ----------------
  async create(
    req: Request,
    createDto: CreatePortfolioCategoryDto,
  ): Promise<PortfolioCategory> {
    const userId = req?.user?.sub;
    if (!userId) {
      throw new UnauthorizedException(
        'Authentication required. You must be signed in to create a portfolio category.',
      );
    }

    const categoryName = createDto.name.trim();

    const exists = await this.portfolioCategoryRepository.exists({
      where: { name: categoryName },
      withDeleted: true,
    });
    if (exists) {
      throw new BadRequestException(
        `Portfolio category "${categoryName}" already exists.`,
      );
    }

    const newCategory = this.portfolioCategoryRepository.create({
      ...createDto,
      name: categoryName,
      added_by: userId,
    });

    return await this.portfolioCategoryRepository.save(newCategory);
  }

  // ---------------- FIND ALL ----------------
  async findAll(
    query?: any, // Optional pagination/filter DTO
  ): Promise<IPagination<Partial<PortfolioCategory>>> {
    return this.dataQueryService.execute<Partial<PortfolioCategory>>({
      repository: this.portfolioCategoryRepository,
      alias: 'portfolioCategory',
      pagination: query,
      searchableFields: ['name'],
      select: ['id', 'name', 'created_at', 'updated_at'],
      relations: ['addedBy'],
    });
  }

  // ---------------- FIND ONE ----------------
  async findOne(id: string): Promise<PortfolioCategory> {
    const category = await this.portfolioCategoryRepository.findOne({
      where: { id },
      relations: ['addedBy'],
    });

    if (!category) {
      throw new BadRequestException('Portfolio category not found');
    }

    return category;
  }

  // ---------------- UPDATE ----------------
  async update(
    id: string,
    updateDto: UpdatePortfolioCategoryDto,
  ): Promise<PortfolioCategory> {
    const category = await this.findOne(id);

    if (updateDto.name) {
      const trimmedName = updateDto.name.trim();

      const exists = await this.portfolioCategoryRepository.exists({
        where: { name: trimmedName, id: Not(id) },
        withDeleted: true,
      });
      if (exists) {
        throw new BadRequestException(
          `Portfolio category name "${trimmedName}" is already in use.`,
        );
      }

      category.name = trimmedName;
    }

    Object.assign(category, updateDto);
    return await this.portfolioCategoryRepository.save(category);
  }

  // ---------------- DELETE (SOFT) ----------------
  async remove(id: string): Promise<void> {
    const result = await this.portfolioCategoryRepository.softDelete(id);
    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: Record might already be removed.',
      );
    }
  }
}
