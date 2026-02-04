import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Request } from 'express';
import { Hero } from './entities/hero.entity';
import { CreateHeroDto, HeroResponseDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { GetHeroDto } from './dto/get-hero.dto';
import { FileUploadsService } from 'src/common/file-uploads/file-uploads.service';

@Injectable()
export class HerosService {
  constructor(
    @InjectRepository(Hero)
    private readonly heroRepository: Repository<Hero>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create a new Hero
   */
  public async create(
    req: Request,
    createHeroDto: CreateHeroDto,
    file?: Express.Multer.File,
  ): Promise<Hero> {
    const userId = req?.user?.sub;
    if (!userId) throw new UnauthorizedException('Authentication required.');

    createHeroDto.title = createHeroDto.title.trim();

    const titleExists = await this.heroRepository.exists({
      where: { title: createHeroDto.title },
    });
    if (titleExists)
      throw new BadRequestException('Hero title already exists.');

    let imageUrl: string | undefined;
    if (file) {
      const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
      imageUrl = uploadedFiles[0];
    }

    const newHero = this.heroRepository.create({
      ...createHeroDto,
      added_by: String(userId),
      image: imageUrl,
    });

    return this.heroRepository.save(newHero);
  }

  /**
   * Get all heroes with filters & pagination
   */
  public async findAll(
    query: GetHeroDto,
  ): Promise<IPagination<Partial<HeroResponseDto>>> {
    return this.dataQueryService.execute<Partial<HeroResponseDto>>({
      repository: this.heroRepository,
      alias: 'hero',
      pagination: query,
      searchableFields: ['title', 'company', 'description'],
      filterableFields: [],
      relations: ['addedBy'],
      select: [
        'id',
        'title',
        'description',
        'company',
        'score',
        'rating',
        'image',
        'videoUrl',
        'campaigns',
        'revenue',
        'created_at',
        'updated_at',
      ],
    });
  }

  /**
   * Get a single hero by UUID
   */
  public async findOne(id: string) {
    const hero = await this.heroRepository.findOne({
      where: { id },
      relations: ['addedBy'],
    });

    if (!hero) throw new NotFoundException('Hero not found.');

    return {
      id: hero.id,
      title: hero.title,
      description: hero.description,
      company: hero.company,
      score: hero.score,
      rating: hero.rating,
      image: hero.image,
      videoUrl: hero.videoUrl,
      campaigns: hero.campaigns,
      revenue: hero.revenue,
      created_at: hero.created_at,
      updated_at: hero.updated_at,
      addedBy: hero.addedBy
        ? {
            id: hero.addedBy.id,
            name: hero.addedBy.name,
          }
        : undefined,
    };
  }

  /**
   * Update hero
   */
  public async update(
    id: string,
    updateHeroDto: UpdateHeroDto,
    file?: Express.Multer.File,
  ): Promise<Hero> {
    const hero = await this.heroRepository.findOne({ where: { id } });
    if (!hero) throw new NotFoundException('Hero not found.');

    if (updateHeroDto.title) {
      updateHeroDto.title = updateHeroDto.title.trim();

      const titleExists = await this.heroRepository.exists({
        where: { title: updateHeroDto.title, id: Not(id) },
      });

      if (titleExists) {
        throw new BadRequestException('Hero title already exists.');
      }
    }

    if (file) {
      if (hero.image) {
        const updatedImage = await this.fileUploadsService.updateFileUploads({
          oldFile: hero.image,
          currentFile: file,
        });
        updateHeroDto.image = updatedImage as string;
      } else {
        const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
        updateHeroDto.image = uploadedFiles[0];
      }
    }

    Object.assign(hero, updateHeroDto);
    return await this.heroRepository.save(hero);
  }

  /**
   * Soft delete hero
   */
  public async remove(id: string): Promise<void> {
    if (!id) throw new BadRequestException('ID is required');

    const hero = await this.heroRepository.findOne({ where: { id } });
    if (!hero) throw new NotFoundException('Hero not found.');

    if (hero.image) {
      try {
        await this.fileUploadsService.deleteFileUploads(hero.image);
      } catch (err) {
        console.warn(`Failed to delete hero image: ${err.message}`);
      }
    }

    const result = await this.heroRepository.softDelete(id);
    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: record might already be removed.',
      );
    }
  }
}
