import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Request } from 'express';
import { Service } from './entities/service.entity';
import { CreateServiceDto, ServiceResponseDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { GetServiceDto } from './dto/get-service.dto';
import { FileUploadsService } from 'src/common/file-uploads/file-uploads.service';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create a new Service
   * @param file - Optional service image
   */
  public async create(
    req: Request,
    createServiceDto: CreateServiceDto,
    file?: Express.Multer.File,
  ): Promise<Service> {
    const userId = req?.user?.sub;
    if (!userId) throw new UnauthorizedException('Authentication required.');

    // Trim input
    createServiceDto.name = createServiceDto.name.trim();

    //  Check for duplicate service name using exists() for performance
    const nameExists = await this.serviceRepository.exists({
      where: { name: createServiceDto.name },
    });
    if (nameExists)
      throw new BadRequestException('Service name already exists.');

    // Handle optional file upload
    let imageUrl: string | undefined;
    if (file) {
      const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
      imageUrl = uploadedFiles[0];
    }

    // Create new service entity
    const newService = this.serviceRepository.create({
      ...createServiceDto,
      added_by: String(userId),
      category_id: String(createServiceDto.category_id),
      image: imageUrl,
    });

    return this.serviceRepository.save(newService);
  }

  /**
   * Get all services with optional filters/pagination
   */
async findAll(query: GetServiceDto): Promise<any> {
  const serviceQuery = this.serviceRepository.createQueryBuilder('service');

  serviceQuery
    // 1. Select main table fields
    .select([
      'service.id',
      'service.name',
      'service.category_id',
      'service.description',
      'service.key_features',
      'service.used_by_companies',
      'service.landing_page',
      'service.rating',
      'service.image',
      'service.created_at',
      'service.updated_at',
    ])
    // 2. Join and Select Category (id and name)
    .leftJoin('service.category', 'category')
    .addSelect([
      'category.id', 
      'category.name'
    ])
    // 3. Join and Select AddedBy (id, name, role)
    .leftJoin('service.addedBy', 'addedBy')
    .addSelect([
      'addedBy.id',
      
    ])
    .orderBy('service.created_at', 'DESC');



  // Manual Category Filter
  if (query.category_id) {
    serviceQuery.andWhere('service.category_id = :catId', { catId: query.category_id });
  }

  return await serviceQuery.getMany();
}

  /**
   * Get a single service by UUID

   */
  public async findOne(id: string) {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['category', 'addedBy', 'why_choose_us','business_we_cover'],
      
    });

    if (!service) throw new NotFoundException('Service not found.');

    // Map the service to only return minimal addedBy and category info
    return {
      id: service.id,
      name: service.name,
      category_id: service.category_id,
      description: service.description,
      key_features: service.key_features,
      used_by_companies: service.used_by_companies,
      landing_page: service.landing_page,
      rating: service.rating,
      districts: service.districts,
      image: service.image,
      video_url: service.video_url,
      created_at: service.created_at,
      updated_at: service.updated_at,
      why_choose_us:service.why_choose_us,
      business_we_cover:service.business_we_cover,
      category: service.category
        ? { id: service.category.id, name: service.category.name }
        : undefined,
      addedBy: service.addedBy
        ? {
            id: service.addedBy.id,
            name: service.addedBy.name,
          }
        : undefined,
    };
  }

  /**
   * Update a service

   */
  public async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
    file?: Express.Multer.File,
  ): Promise<Service> {
    // Find existing service by ID
    const service = await this.findOne(id);

    //  Check for duplicate service name if updating
    if (updateServiceDto.name) {
      updateServiceDto.name = updateServiceDto.name.trim();

      const nameExists = await this.serviceRepository.exists({
        where: { name: updateServiceDto.name, id: Not(id) },
      });

      if (nameExists) {
        throw new BadRequestException('Service name already exists.');
      }
    }

    // Handle optional image update
    if (file) {
      if (service.image) {
        //  Update existing file
        const updatedImage = await this.fileUploadsService.updateFileUploads({
          oldFile: service.image,
          currentFile: file,
        });
        updateServiceDto.image = updatedImage as string;
      } else {
        //  Upload new file
        const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
        updateServiceDto.image = uploadedFiles[0];
      }
    }
    //  Merge new data into existing entity
    Object.assign(service, updateServiceDto);

    // Save updated entity
    return await this.serviceRepository.save(service);
  }

  /**
   * Soft delete a service
   * @param id - Service UUID
   */
  public async remove(id: string): Promise<void> {
    if (!id) throw new BadRequestException('ID is required');

    //  Fetch service
    const service = await this.findOne(id);

    //  Optional: delete image file if exists
    if (service.image) {
      try {
        await this.fileUploadsService.deleteFileUploads(service.image);
      } catch (err) {
        // Log the error but don't block soft deletion
        console.warn(`Failed to delete service image: ${err.message}`);
      }
    }

    //  Soft delete record
    const result = await this.serviceRepository.softDelete(id);
    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: record might already be removed.',
      );
    }
  }
}
