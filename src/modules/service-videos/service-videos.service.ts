import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import type { Request } from 'express';

import { ServiceVideo } from './entities/service-video.entity';
import { CreateServiceVideoDto } from './dto/create-service-video.dto';
import { UpdateServiceVideoDto } from './dto/update-service-video.dto';
import { GetServiceVideoDto } from './dto/get-service-video.dto';
import { FileUploadsService } from 'src/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';

@Injectable()
export class ServiceVideosService {
  constructor(
    @InjectRepository(ServiceVideo)
    private readonly serviceVideoRepository: Repository<ServiceVideo>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create Service Video
   */
  async create(
    req: Request,
    createDto: CreateServiceVideoDto,
    file?: Express.Multer.File,
  ): Promise<ServiceVideo> {
    const userId = req?.user?.sub;
    if (!userId) throw new UnauthorizedException('Authentication required.');

    createDto.title = createDto.title.trim();

    const exists = await this.serviceVideoRepository.exists({
      where: {
        title: createDto.title,
      },
    });

    if (exists) {
      throw new BadRequestException(
        'A service video with this title already exists for this service.',
      );
    }

    let thumbnailUrl: string | undefined;
    if (file) {
      const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
      thumbnailUrl = uploadedFiles[0];
    }

    const newVideo = this.serviceVideoRepository.create({
      ...createDto,
      added_by: String(userId),
    });

    return this.serviceVideoRepository.save(newVideo);
  }

  /**
   * Get all service videos
   */

  async findAll(query: GetServiceVideoDto): Promise<ServiceVideo[]> {
    const qb = this.serviceVideoRepository.createQueryBuilder('sv');

    // 1. Select main table fields
    qb.select([
      'sv.id',
      'sv.title',
      'sv.thumbnail',
      'sv.video_url',
      'sv.is_active',
      'sv.created_at',
      'sv.updated_at',
      'sv.service_id',
      'sv.added_by',
    ]);

    // 2. Join related Service
    qb.leftJoin('sv.service', 'service').addSelect([
      'service.id',
      'service.name',
    ]);

    // 3. Join AddedBy (User)
    qb.leftJoin('sv.addedBy', 'addedBy').addSelect([
      'addedBy.id',
      'addedBy.name',
      'addedBy.email',
      'addedBy.role',
    ]);

    // 4. Optional: add filters from query DTO
    if (query.service_id) {
      qb.andWhere('sv.service_id = :service_id', {
        service_id: query.service_id,
      });
    }

    if (query.is_active !== undefined) {
      qb.andWhere('sv.is_active = :is_active', { is_active: query.is_active });
    }

    // 5. Order
    qb.orderBy('sv.created_at', 'DESC');

    const videos = await qb.getMany();

    if (!videos.length) {
      throw new NotFoundException('No service videos found.');
    }

    return videos;
  }

  /**
   * Get single service video
   */
  async findOne(id: string): Promise<ServiceVideo> {
    const video = await this.serviceVideoRepository.findOne({
      where: { id },
      relations: {
        service: true,
        addedBy: true,
      },
      select: {
        service: { id: true, name: true },
        addedBy: { id: true, name: true, email: true, role: true },
      },
    });

    if (!video) throw new NotFoundException('Service video not found.');

    return video;
  }

  /**
   * Update service video
   */
  async update(
    id: string,
    updateDto: UpdateServiceVideoDto,
    file?: Express.Multer.File,
  ): Promise<ServiceVideo> {
    const video = await this.findOne(id);

    if (updateDto.title) {
      updateDto.title = updateDto.title.trim();

      const exists = await this.serviceVideoRepository.exists({
        where: {
          title: updateDto.title,
          id: Not(id),
        },
      });

      if (exists) {
        throw new BadRequestException(
          'Another service video with this title already exists for this service.',
        );
      }
    }

    if (file) {
      if (video.thumbnail) {
        const updatedImage = await this.fileUploadsService.updateFileUploads({
          oldFile: video.thumbnail,
          currentFile: file,
        });
        updateDto.thumbnail = updatedImage as string;
      } else {
        const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
        updateDto.thumbnail = uploadedFiles[0];
      }
    }
    Object.assign(video, updateDto);
    return this.serviceVideoRepository.save(video);
  }

  /**
   * Soft delete service video
   */
  async remove(id: string): Promise<void> {
    const video = await this.findOne(id);

    if (video.thumbnail) {
      try {
        await this.fileUploadsService.deleteFileUploads(video.thumbnail);
      } catch (err) {
        console.warn(`Failed to delete thumbnail: ${err.message}`);
      }
    }

    const result = await this.serviceVideoRepository.softDelete(id);
    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: record might already be removed.',
      );
    }
  }
}
