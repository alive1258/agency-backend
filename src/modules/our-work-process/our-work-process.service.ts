import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Request } from 'express';
import { OurWorkProcess } from './entities/our-work-process.entity';
import {
  CreateOurWorkProcessDto,
  OurWorkProcessResponseDto,
} from './dto/create-our-work-process.dto';
import { UpdateOurWorkProcessDto } from './dto/update-our-work-process.dto';
import { GetOurWorkProcessDto } from './dto/get-our-work-process.dto';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { FileUploadsService } from 'src/common/file-uploads/file-uploads.service';

@Injectable()
export class OurWorkProcessService {
  constructor(
    @InjectRepository(OurWorkProcess)
    private readonly ourWorkProcessRepository: Repository<OurWorkProcess>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create Our Work Process (WITH IMAGE)
   */
  public async create(
    req: Request,
    createDto: CreateOurWorkProcessDto,
    file?: Express.Multer.File,
  ): Promise<OurWorkProcess> {
    const userId = req?.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    createDto.title = createDto.title.trim();

    const exists = await this.ourWorkProcessRepository.exists({
      where: { title: createDto.title },
    });

    if (exists) {
      throw new BadRequestException('Our Work Process title already exists.');
    }

    let imageUrl: string | undefined;
    if (file) {
      const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
      imageUrl = uploadedFiles[0];
    }

    const process = this.ourWorkProcessRepository.create({
      ...createDto,
      image: imageUrl,
      added_by: String(userId),
    });

    return this.ourWorkProcessRepository.save(process);
  }

  /**
   * Get all Our Work Processes (pagination + filters)
   */
  public async findAll(
    query: GetOurWorkProcessDto,
  ): Promise<IPagination<Partial<OurWorkProcessResponseDto>>> {
    return this.dataQueryService.execute<Partial<OurWorkProcessResponseDto>>({
      repository: this.ourWorkProcessRepository,
      alias: 'ourWorkProcess',
      pagination: query,
      searchableFields: ['title', 'description'],
      filterableFields: [],
      relations: ['addedBy'],
      select: [
        'id',
        'title',
        'description',
        'color_code',
        'image',
        'created_at',
        'updated_at',
      ],
    });
  }

  /**
   * Get single Our Work Process by UUID
   */
  public async findOne(id: string) {
    const process = await this.ourWorkProcessRepository.findOne({
      where: { id },
      relations: ['addedBy'],
    });

    if (!process) {
      throw new NotFoundException('Our Work Process not found.');
    }

    return {
      id: process.id,
      title: process.title,
      description: process.description,
      color_code: process.color_code,
      image: process.image,
      created_at: process.created_at,
      updated_at: process.updated_at,
      addedBy: process.addedBy
        ? {
            id: process.addedBy.id,
            name: process.addedBy.name,
          }
        : undefined,
    };
  }

  /**
   * Update Our Work Process (WITH IMAGE UPDATE)
   */
  public async update(
    id: string,
    updateDto: UpdateOurWorkProcessDto,
    file?: Express.Multer.File,
  ): Promise<OurWorkProcess> {
    const process = await this.ourWorkProcessRepository.findOne({
      where: { id },
    });

    if (!process) {
      throw new NotFoundException('Our Work Process not found.');
    }

    if (updateDto.title) {
      updateDto.title = updateDto.title.trim();

      const exists = await this.ourWorkProcessRepository.exists({
        where: {
          title: updateDto.title,
          id: Not(id),
        },
      });

      if (exists) {
        throw new BadRequestException('Our Work Process title already exists.');
      }
    }

    if (file) {
      if (process.image) {
        const updatedImage = await this.fileUploadsService.updateFileUploads({
          oldFile: process.image,
          currentFile: file,
        });
        updateDto.image = updatedImage as string;
      } else {
        const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
        updateDto.image = uploadedFiles[0];
      }
    }

    Object.assign(process, updateDto);
    return this.ourWorkProcessRepository.save(process);
  }

  /**
   * Soft delete Our Work Process (WITH IMAGE DELETE)
   */
  public async remove(id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException('ID is required.');
    }

    const process = await this.ourWorkProcessRepository.findOne({
      where: { id },
    });

    if (!process) {
      throw new NotFoundException('Our Work Process not found.');
    }

    if (process.image) {
      try {
        await this.fileUploadsService.deleteFileUploads(process.image);
      } catch (err) {
        console.warn(`Failed to delete OurWorkProcess image: ${err.message}`);
      }
    }

    const result = await this.ourWorkProcessRepository.softDelete(id);

    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: record might already be removed.',
      );
    }
  }
}
