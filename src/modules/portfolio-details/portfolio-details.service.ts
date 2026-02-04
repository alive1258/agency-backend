import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Request } from 'express';

import { PortfolioDetail } from './entities/portfolio-detail.entity';
import { CreatePortfolioDetailDto } from './dto/create-portfolio-detail.dto';
import { UpdatePortfolioDetailDto } from './dto/update-portfolio-detail.dto';
import { GetPortfolioDetailDto } from './dto/get-portfolio-detail.dto';

import { FileUploadsService } from 'src/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/common/data-query/data-query.service';

@Injectable()
export class PortfolioDetailsService {
  constructor(
    @InjectRepository(PortfolioDetail)
    private readonly portfolioDetailRepository: Repository<PortfolioDetail>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create Portfolio Detail
   */
  async create(
    req: Request,
    createPortfolioDetailDto: CreatePortfolioDetailDto,
    file?: Express.Multer.File,
  ): Promise<PortfolioDetail> {
    const userId = req?.user?.sub;
    if (!userId) throw new UnauthorizedException('Authentication required.');

    createPortfolioDetailDto.title = createPortfolioDetailDto.title?.trim();

    // Duplicate title check
    const exists = await this.portfolioDetailRepository.exists({
      where: { title: createPortfolioDetailDto.title },
    });

    if (exists) {
      throw new BadRequestException('Portfolio detail title already exists.');
    }

    // Image upload
    let imageUrl: string | undefined;
    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads([file]);
      imageUrl = uploaded[0];
    }

    const portfolioDetail = this.portfolioDetailRepository.create({
      ...createPortfolioDetailDto,
      image: imageUrl,
      added_by: String(userId),
      portfolio_id: String(createPortfolioDetailDto.portfolio_id),
    });

    return await this.portfolioDetailRepository.save(portfolioDetail);
  }

  /**
   * Get All Portfolio Details
   */
  async findAll(query: GetPortfolioDetailDto): Promise<PortfolioDetail[]> {
    const qb = this.portfolioDetailRepository.createQueryBuilder('portfolio');

    qb.select([
      'portfolio.id',
      'portfolio.title',
      'portfolio.description',
      'portfolio.image',
      'portfolio.portfolio_id',
      'portfolio.created_at',
      'portfolio.updated_at',
    ])
      .leftJoin('portfolio.category', 'category')
      .addSelect(['category.id', 'category.name'])
      .orderBy('portfolio.created_at', 'DESC');

    // Filter by category
    if (query.portfolio_id) {
      qb.andWhere('portfolio.portfolio_id = :portfolioId', {
        portfolioId: query.portfolio_id,
      });
    }

    return await qb.getMany();
  }

  /**
   * Get Single Portfolio Detail
   */
  async findOne(id: string): Promise<any> {
    const portfolio = await this.portfolioDetailRepository.findOne({
      where: { id },
      relations: ['portfolio', 'addedBy'],
    });

    if (!portfolio) throw new NotFoundException('Portfolio detail not found.');

    return {
      id: portfolio.id,
      title: portfolio.title,
      description: portfolio.description,
      image: portfolio.image,
      created_at: portfolio.created_at,
      updated_at: portfolio.updated_at,
      portfolio: portfolio.portfolio
        ? {
            id: portfolio.portfolio.id,
            title: portfolio.portfolio.title,
          }
        : undefined,
      addedBy: portfolio.addedBy
        ? {
            id: portfolio.addedBy.id,
            name: portfolio.addedBy.name,
          }
        : undefined,
    };
  }

  /**
   * Update Portfolio Detail
   */
  async update(
    id: string,
    updatePortfolioDetailDto: UpdatePortfolioDetailDto,
    file?: Express.Multer.File,
  ): Promise<PortfolioDetail> {
    const portfolio = await this.portfolioDetailRepository.findOne({
      where: { id },
    });

    if (!portfolio) throw new NotFoundException('Portfolio detail not found.');

    // Duplicate title check
    if (updatePortfolioDetailDto.title) {
      updatePortfolioDetailDto.title = updatePortfolioDetailDto.title.trim();

      const exists = await this.portfolioDetailRepository.exists({
        where: {
          title: updatePortfolioDetailDto.title,
          id: Not(id),
        },
      });

      if (exists) {
        throw new BadRequestException('Portfolio detail title already exists.');
      }
    }

    // Image update
    if (file) {
      if (portfolio.image) {
        const updatedImage = await this.fileUploadsService.updateFileUploads({
          oldFile: portfolio.image,
          currentFile: file,
        });
        updatePortfolioDetailDto.image = updatedImage as string;
      } else {
        const uploaded = await this.fileUploadsService.fileUploads([file]);
        updatePortfolioDetailDto.image = uploaded[0];
      }
    }

    Object.assign(portfolio, updatePortfolioDetailDto);
    return await this.portfolioDetailRepository.save(portfolio);
  }

  /**
   * Soft Delete Portfolio Detail
   */
  async remove(id: string): Promise<void> {
    if (!id) throw new BadRequestException('ID is required.');

    const portfolio = await this.portfolioDetailRepository.findOne({
      where: { id },
    });

    if (!portfolio) throw new NotFoundException('Portfolio detail not found.');

    // Delete image
    if (portfolio.image) {
      try {
        await this.fileUploadsService.deleteFileUploads(portfolio.image);
      } catch (err) {
        console.warn(`Failed to delete portfolio image: ${err.message}`);
      }
    }

    const result = await this.portfolioDetailRepository.softDelete(id);

    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: record may already be removed.',
      );
    }
  }
}
