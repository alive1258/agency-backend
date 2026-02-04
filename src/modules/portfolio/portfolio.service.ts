import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Request } from 'express';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioCategory } from 'src/modules/portfolio-categories/entities/portfolio-category.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { FileUploadsService } from 'src/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { GetPortfolioDto } from './dto/get-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create a new Portfolio
   */
  async create(
    req: Request,
    createPortfolioDto: CreatePortfolioDto,
    file?: Express.Multer.File,
  ): Promise<Portfolio> {
    const userId = req?.user?.sub;
    if (!userId) throw new UnauthorizedException('Authentication required.');

    // Trim title
    createPortfolioDto.title = createPortfolioDto.title.trim();

    // Check duplicate title
    const titleExists = await this.portfolioRepository.exists({
      where: { title: createPortfolioDto.title },
    });

    if (titleExists) {
      throw new BadRequestException('Portfolio title already exists.');
    }

    // Handle optional image upload
    let imageUrl: string | undefined;
    if (file) {
      const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
      imageUrl = uploadedFiles[0];
    }

    const newPortfolio = this.portfolioRepository.create({
      ...createPortfolioDto,
      added_by: String(userId),
      portfolio_category_id: String(createPortfolioDto.portfolio_category_id),
      image: imageUrl,
    });

    return await this.portfolioRepository.save(newPortfolio);
  }

  /**
   * Get all portfolios (with filters)
   */
  async findAll(query: GetPortfolioDto): Promise<any> {
    const portfolioQuery =
      this.portfolioRepository.createQueryBuilder('portfolio');

    portfolioQuery
      .select([
        'portfolio.id',
        'portfolio.title',
        'portfolio.portfolio_category_id',
        'portfolio.description',
        'portfolio.company_name',
        'portfolio.image',
        'portfolio.created_at',
        'portfolio.updated_at',
      ])
      .leftJoin('portfolio.portfolio_category', 'category')
      .addSelect(['category.id', 'category.name'])
      .leftJoin('portfolio.addedBy', 'addedBy')
      .addSelect(['addedBy.id', 'addedBy.name'])
      .orderBy('portfolio.created_at', 'DESC');

    // Filter by category
    if (query.portfolio_category_id) {
      portfolioQuery.andWhere('portfolio.portfolio_category_id = :catId', {
        catId: query.portfolio_category_id,
      });
    }

    return await portfolioQuery.getMany();
  }

  /**
   * Get single portfolio by UUID
   */
  async findOne(id: string): Promise<any> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id },
      relations: ['portfolio_category', 'addedBy'],
    });

    if (!portfolio) throw new NotFoundException('Portfolio not found.');

    return {
      id: portfolio.id,
      title: portfolio.title,
      description: portfolio.description,
      company_name: portfolio.company_name,
      image: portfolio.image,
      created_at: portfolio.created_at,
      updated_at: portfolio.updated_at,
      category: portfolio.portfolio_category
        ? {
            id: portfolio.portfolio_category.id,
            name: portfolio.portfolio_category.name,
          }
        : undefined,
      addedBy: portfolio.addedBy
        ? { id: portfolio.addedBy.id, name: portfolio.addedBy.name }
        : undefined,
    };
  }

  /**
   * Update a portfolio
   */
  async update(
    id: string,
    updatePortfolioDto: UpdatePortfolioDto,
    file?: Express.Multer.File,
  ): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({ where: { id } });
    if (!portfolio) throw new NotFoundException('Portfolio not found.');

    // Check duplicate title
    if (updatePortfolioDto.title) {
      updatePortfolioDto.title = updatePortfolioDto.title.trim();

      const titleExists = await this.portfolioRepository.exists({
        where: { title: updatePortfolioDto.title, id: Not(id) },
      });

      if (titleExists) {
        throw new BadRequestException('Portfolio title already exists.');
      }
    }

    // Handle image update
    if (file) {
      if (portfolio.image) {
        const updatedImage = await this.fileUploadsService.updateFileUploads({
          oldFile: portfolio.image,
          currentFile: file,
        });
        updatePortfolioDto.image = updatedImage as string;
      } else {
        const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
        updatePortfolioDto.image = uploadedFiles[0];
      }
    }

    Object.assign(portfolio, updatePortfolioDto);
    return await this.portfolioRepository.save(portfolio);
  }

  /**
   * Soft delete a portfolio
   */
  async remove(id: string): Promise<void> {
    if (!id) throw new BadRequestException('ID is required');

    const portfolio = await this.portfolioRepository.findOne({ where: { id } });
    if (!portfolio) throw new NotFoundException('Portfolio not found.');

    // Delete image if exists
    if (portfolio.image) {
      try {
        await this.fileUploadsService.deleteFileUploads(portfolio.image);
      } catch (err) {
        console.warn(`Failed to delete portfolio image: ${err.message}`);
      }
    }

    const result = await this.portfolioRepository.softDelete(id);
    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: record might already be removed.',
      );
    }
  }
}
