import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Request } from 'express';
import { Testimonial } from './entities/testimonial.entity';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { GetTestimonialDto } from './dto/get-testimonial.dto';
import { FileUploadsService } from 'src/common/file-uploads/file-uploads.service';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create a new testimonial
   */
  async create(
    req: Request,
    createTestimonialDto: CreateTestimonialDto,
    file?: Express.Multer.File,
  ): Promise<Testimonial> {
    const userId = req?.user?.sub;
    if (!userId) throw new UnauthorizedException('Authentication required.');

    // Trim name/degination
    createTestimonialDto.name = createTestimonialDto.name.trim();
    if (createTestimonialDto.name)
      createTestimonialDto.name = createTestimonialDto.name.trim();

    // Handle optional file upload
    let imageUrl: string | undefined;
    if (file) {
      const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
      imageUrl = uploadedFiles[0];
    }

    const newTestimonial = this.testimonialRepository.create({
      ...createTestimonialDto,
      added_by: String(userId),
      service_id: String(createTestimonialDto.service_id),
      image: imageUrl,
    });

    return this.testimonialRepository.save(newTestimonial);
  }

  /**
   * Get all testimonials with optional filters/pagination
   */
  async findAll(
    query: GetTestimonialDto,
  ): Promise<IPagination<Partial<Testimonial>>> {
    return this.dataQueryService.execute<Partial<Testimonial>>({
      repository: this.testimonialRepository,
      alias: 'testimonial',
      pagination: query,
      searchableFields: ['name', 'degination', 'description'],
      filterableFields: ['service_id'],
      relations: ['service', 'addedBy'],
      select: [
        'id',
        'name',
        'designation',
        'description',
        'rating',
        'performance',
        'image',
        'created_at',
        'updated_at',
      ],
    });
  }

  /**
   * Get a single testimonial by UUID
   */
  async findOne(id: string): Promise<Testimonial> {
    const testimonial = await this.testimonialRepository.findOne({
      where: { id },
      relations: ['service', 'addedBy'],
    });
    if (!testimonial) throw new NotFoundException('Testimonial not found.');

    return testimonial;
  }

  /**
   * Update a testimonial
   */
  async update(
    id: string,
    updateTestimonialDto: UpdateTestimonialDto,
    file?: Express.Multer.File,
  ): Promise<Testimonial> {
    const testimonial = await this.findOne(id);

    // Optional image update
    if (file) {
      if (testimonial.image) {
        const updatedImage = await this.fileUploadsService.updateFileUploads({
          oldFile: testimonial.image,
          currentFile: file,
        });
        updateTestimonialDto.image = updatedImage as string;
      } else {
        const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
        updateTestimonialDto.image = uploadedFiles[0];
      }
    }

    Object.assign(testimonial, updateTestimonialDto);
    return this.testimonialRepository.save(testimonial);
  }

  /**
   * Soft delete a testimonial
   */
  async remove(id: string): Promise<void> {
    const testimonial = await this.findOne(id);

    if (testimonial.image) {
      try {
        await this.fileUploadsService.deleteFileUploads(testimonial.image);
      } catch (err) {
        console.warn(`Failed to delete testimonial image: ${err.message}`);
      }
    }

    const result = await this.testimonialRepository.softDelete(id);
    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: record might already be removed.',
      );
    }
  }
}
