import { Request } from 'express';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateWhyChooseUsDto,
  WhyChooseUsResponseDto,
} from './dto/create-why-choose-us.dto';
import { UpdateWhyChooseUsDto } from './dto/update-why-choose-us.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WhyChooseUs } from './entities/why-choose-us.entity';
import { Not, Repository } from 'typeorm';
import { GetWhyChooseUsDto } from './dto/get-why-choose-us.dto';
import { IPagination } from 'src/common/data-query/pagination.interface';

@Injectable()
export class WhyChooseUsService {
  constructor(
    @InjectRepository(WhyChooseUs)
    private readonly whyChooseUsRepository: Repository<WhyChooseUs>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  async create(
    req: Request,
    createWhyChooseUsDto: CreateWhyChooseUsDto,
  ): Promise<WhyChooseUsResponseDto> {
    const userId = req?.user?.sub;

    if (!userId) {
      throw new UnauthorizedException(
        'Authentication required. You must be signed in to create this record.',
      );
    }

    const headline = createWhyChooseUsDto.headline.trim();

    // PERFORMANCE: exists() instead of findOne()
    const isExisting = await this.whyChooseUsRepository.exists({
      where: {
        headline,
        service_id: createWhyChooseUsDto.service_id,
      },
      withDeleted: true,
    });

    if (isExisting) {
      throw new BadRequestException(
        `Why Choose Us headline "${headline}" already exists for this service.`,
      );
    }

    const newWhyChooseUs = this.whyChooseUsRepository.create({
      ...createWhyChooseUsDto,
      headline,
      added_by: userId,
    });

    return await this.whyChooseUsRepository.save(newWhyChooseUs);
  }

  async findAll(query: GetWhyChooseUsDto) {
    const queryBuilder =
      this.whyChooseUsRepository.createQueryBuilder('whyChooseUs');

    queryBuilder
      // 1. Select main table fields (including foreign keys)
      .select([
        'whyChooseUs.id',
        'whyChooseUs.headline',
        'whyChooseUs.service_id', // Important for mapping
        'whyChooseUs.added_by', // Important for mapping
        'whyChooseUs.is_active',
        'whyChooseUs.created_at',
        'whyChooseUs.updated_at',
      ])
      // 2. Join and Select Service (id and name)
      .leftJoin('whyChooseUs.service', 'service')
      .addSelect(['service.id', 'service.name'])
      // 3. Join and Select AddedBy (id, name, role)
      .leftJoin('whyChooseUs.addedBy', 'addedBy')
      .addSelect(['addedBy.id', 'addedBy.name'])
      .orderBy('whyChooseUs.created_at', 'DESC');
    // or manually add .skip() and .take() here.
    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<WhyChooseUsResponseDto> {
    const record = await this.whyChooseUsRepository.findOne({
      where: { id },
      withDeleted: true, // Keeping your soft-delete requirement
      relations: ['service', 'addedBy'],
      select: {
        id: true,
        headline: true, // matches WhyChooseUs schema
        service_id: true,
        added_by: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        // Select specific fields for Service
        service: {
          id: true,
          name: true,
        },
        // Select specific fields for AddedBy
        addedBy: {
          id: true,
          name: true,
        },
      },
    });

    if (!record) {
      throw new BadRequestException('Why Choose Us record not found');
    }

    return record as unknown as WhyChooseUsResponseDto;
  }

  async update(
    id: string,
    updateWhyChooseUsDto: UpdateWhyChooseUsDto,
  ): Promise<WhyChooseUsResponseDto> {
    const record = await this.findOne(id);

    if (updateWhyChooseUsDto.headline) {
      const trimmedHeadline = updateWhyChooseUsDto.headline.trim();

      // Industry-standard uniqueness check
      const isHeadlineTaken = await this.whyChooseUsRepository.exists({
        where: {
          headline: trimmedHeadline,
          service_id: record.service_id,
          id: Not(id),
        },
        withDeleted: true,
      });

      if (isHeadlineTaken) {
        throw new BadRequestException(
          `Headline "${trimmedHeadline}" is already in use.`,
        );
      }

      record.headline = trimmedHeadline;
    }

    Object.assign(record, updateWhyChooseUsDto);
    return await this.whyChooseUsRepository.save(record);
  }

  async remove(id: string): Promise<{ message: string; id: string }> {
    const record = await this.findOne(id);

    // PERFORMANCE: softDelete is faster than softRemove
    const result = await this.whyChooseUsRepository.softDelete(id);

    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: Record might already be removed.',
      );
    }

    return {
      message: `Why Choose Us "${record.headline}" deleted successfully`,
      id,
    };
  }
}
