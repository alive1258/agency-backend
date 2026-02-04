import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import type { Request } from 'express';

import { ServiceReview } from './entities/service-review.entity';
import { CreateServiceReviewDto } from './dto/create-service-review.dto';
import { UpdateServiceReviewDto } from './dto/update-service-review.dto';
import { GetServiceReviewDto } from './dto/get-service-review.dto';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';
import {
  PaymentHistory,
  PaymentStatus,
} from '../subscriptions/entities/payment-history.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ServiceReviewsService {
  constructor(
    @InjectRepository(ServiceReview)
    private readonly serviceReviewRepository: Repository<ServiceReview>,
    private readonly dataQueryService: DataQueryService,

    @InjectRepository(PaymentHistory)
    private readonly paymentRepository: Repository<PaymentHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new review
   */
  async create(
    req: Request,
    createDto: CreateServiceReviewDto,
  ): Promise<ServiceReview> {
    const userId = req?.user?.sub;
    if (!userId)
      throw new UnauthorizedException(
        'You need to be logged in to write a review.',
      );

    const { service_id } = createDto;

    //  Check if user has a successful payment for this service
    const payment = await this.paymentRepository.findOne({
      where: { added_by: userId, service_id, status: PaymentStatus.SUCCESS },
    });

    if (!payment) {
      throw new BadRequestException(
        'You need to purchase this service before leaving a review.',
      );
    }

    //  Check that user role is premium_user
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User information not found.');
    }

    if (user.role !== 'premium_user') {
      throw new BadRequestException(
        'Only premium users can leave reviews. Upgrade your account to premium to share your feedback!',
      );
    }

    const newReview = this.serviceReviewRepository.create({
      ...createDto,
      added_by: String(userId),
    });

    return this.serviceReviewRepository.save(newReview);
  }

  /**
   * Get all reviews with filters & pagination
   */
  async findAll(query: GetServiceReviewDto): Promise<ServiceReview[]> {
    const qb = this.serviceReviewRepository.createQueryBuilder('review');

    // 1. Select main table fields
    qb.select([
      'review.id',
      'review.rating',
      'review.message',
      'review.is_active',
      'review.created_at',
      'review.updated_at',
      'review.service_id',
      'review.service_video_id',
      'review.added_by',
    ]);

    // 2. Join related Service
    qb.leftJoin('review.service', 'service').addSelect([
      'service.id',
      'service.name',
    ]);

    // 3. Join related ServiceVideo
    qb.leftJoin('review.service_video', 'video').addSelect([
      'video.id',
      'video.title',
    ]);

    // 4. Join AddedBy (User)
    qb.leftJoin('review.addedBy', 'addedBy').addSelect([
      'addedBy.id',
      'addedBy.name',
      'addedBy.email',
      'addedBy.role',
    ]);

    // 5. Optional filters
    if (query.service_id) {
      qb.andWhere('review.service_id = :service_id', {
        service_id: query.service_id,
      });
    }

    if (query.service_video_id) {
      qb.andWhere('review.service_video_id = :video_id', {
        video_id: query.service_video_id,
      });
    }

    if (query.is_active !== undefined) {
      qb.andWhere('review.is_active = :is_active', {
        is_active: query.is_active,
      });
    }

    // 6. Order by creation date
    qb.orderBy('review.created_at', 'DESC');

    // 7. Execute query
    const reviews = await qb.getMany();

    if (!reviews.length) {
      throw new NotFoundException('No service reviews found.');
    }

    return reviews;
  }

  /**
   * Get single review by UUID
   */
  async findOne(id: string): Promise<ServiceReview> {
    const review = await this.serviceReviewRepository.findOne({
      where: { id },
      relations: { service: true, service_video: true, addedBy: true },
      select: {
        service: { id: true, name: true },
        service_video: { id: true, title: true },
        addedBy: { id: true, name: true, email: true, role: true },
      },
    });

    if (!review) throw new NotFoundException('Service review not found.');
    return review;
  }

  /**
   * Update review
   */
  async update(
    id: string,
    updateDto: UpdateServiceReviewDto,
  ): Promise<ServiceReview> {
    const review = await this.findOne(id);

    if (updateDto.rating !== undefined) {
      review.rating = updateDto.rating;
    }
    if (updateDto.message) {
      review.message = updateDto.message.trim();
    }

    return this.serviceReviewRepository.save(review);
  }

  /**
   * Soft delete review
   */
  async remove(id: string): Promise<void> {
    const review = await this.findOne(id);

    const result = await this.serviceReviewRepository.softDelete(id);
    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: review might already be removed.',
      );
    }
  }
}
