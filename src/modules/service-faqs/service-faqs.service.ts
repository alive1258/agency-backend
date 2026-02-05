import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Request } from 'express';

import { ServiceFaq } from './entities/service-faq.entity';
import {
  CreateServiceFaqDto,
  ServiceFaqResponseDto,
} from './dto/create-service-faq.dto';
import { UpdateServiceFaqDto } from './dto/update-service-faq.dto';
import { GetServiceFaqDto } from './dto/get-service-faq.dto';

import { IPagination } from 'src/common/data-query/pagination.interface';
import { DataQueryService } from 'src/common/data-query/data-query.service';

@Injectable()
export class ServiceFaqsService {
  constructor(
    @InjectRepository(ServiceFaq)
    private readonly serviceFaqRepository: Repository<ServiceFaq>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create Service FAQ
   */
  public async create(
    req: Request,
    createDto: CreateServiceFaqDto,
  ): Promise<ServiceFaq> {
    const userId = req?.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }

    createDto.question = createDto.question.trim();

    const exists = await this.serviceFaqRepository.exists({
      where: {
        question: createDto.question,
      },
    });

    if (exists) {
      throw new BadRequestException(
        'FAQ with this question already exists for this service.',
      );
    }

    const faq = this.serviceFaqRepository.create({
      ...createDto,
      added_by: String(userId),
    });

    return this.serviceFaqRepository.save(faq);
  }

  /**
   * Get all Service FAQs (pagination + filters)
   */
  public async findAll(
    query: GetServiceFaqDto,
  ): Promise<IPagination<Partial<ServiceFaqResponseDto>>> {
    return this.dataQueryService.execute<Partial<ServiceFaqResponseDto>>({
      repository: this.serviceFaqRepository,
      alias: 'serviceFaq',
      pagination: query,
      searchableFields: ['question', 'answer'],
      filterableFields: ['service_id', 'is_active'],
      relations: ['addedBy', 'service'],
      select: [
        'id',
        'question',
        'answer',
        'is_active',
        'service_id',
        'created_at',
        'updated_at',
      ],
    });
  }

  /**
   * Get single Service FAQ by UUID
   */
  public async findOne(id: string) {
    const faq = await this.serviceFaqRepository.findOne({
      where: { id },
      relations: ['addedBy', 'service'],
    });

    if (!faq) {
      throw new NotFoundException('Service FAQ not found.');
    }

    return {
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      is_active: faq.is_active,
      service: faq.service
        ? {
            id: faq.service.id,
            name: faq.service.name,
          }
        : undefined,
      addedBy: faq.addedBy
        ? {
            id: faq.addedBy.id,
            name: faq.addedBy.name,
          }
        : undefined,
      created_at: faq.created_at,
      updated_at: faq.updated_at,
    };
  }

  /**
   * Update Service FAQ
   */
  public async update(
    id: string,
    updateDto: UpdateServiceFaqDto,
  ): Promise<ServiceFaq> {
    const faq = await this.serviceFaqRepository.findOne({
      where: { id },
    });

    if (!faq) {
      throw new NotFoundException('Service FAQ not found.');
    }

    if (updateDto.question) {
      updateDto.question = updateDto.question.trim();

      const exists = await this.serviceFaqRepository.exists({
        where: {
          question: updateDto.question,
          service_id: faq.service_id,
          id: Not(id),
        },
      });

      if (exists) {
        throw new BadRequestException(
          'FAQ with this question already exists for this service.',
        );
      }
    }

    Object.assign(faq, updateDto);
    return this.serviceFaqRepository.save(faq);
  }

  /**
   * Soft delete Service FAQ
   */
  public async remove(id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException('ID is required.');
    }

    const faq = await this.serviceFaqRepository.findOne({
      where: { id },
    });

    if (!faq) {
      throw new NotFoundException('Service FAQ not found.');
    }

    const result = await this.serviceFaqRepository.softDelete(id);

    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: record might already be removed.',
      );
    }
  }
}
