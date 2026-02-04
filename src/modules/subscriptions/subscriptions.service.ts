import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Request } from 'express';
import { GetSubscriptionDto } from './dto/get-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Subscription,
  SubscriptionStatus,
} from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { IPagination } from 'src/common/data-query/pagination.interface';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly dataQueryService: DataQueryService,
  ) { }

  /**
   * Create new subscription
   */
  create(req: Request, createSubscriptionDto: CreateSubscriptionDto) {
    return 'This action adds a new subscription';
  }


  /**
   * Get all subscriptions
   */
  async findAll(
    query: GetSubscriptionDto,
  ): Promise<IPagination<Subscription>> {
    const result = await this.dataQueryService.execute<Subscription>({
      repository: this.subscriptionRepository,
      alias: 'subscription',
      pagination: query,
      relations: ['service', 'pricing', 'added_by_user'],
      selectRelations:[
        'subscription.price',
        "service.id",
        "service.name",
        "added_by_user.id",
        "added_by_user.name",
        "added_by_user.email",
        "added_by_user.mobile",
        "pricing.id",
        "pricing.price",
      ]
    });

    if (!result.data.length) {
      throw new NotFoundException('No pricing records found.');
    }

    return result
  }

  async findOne(id: string): Promise<Subscription | null> {
    return await this.subscriptionRepository.findOne(
      {
        where: { id },
        relations: {
          service: true,
          added_by_user: true,
          pricing: true,
        },
        select: {
          service: {
            id: true,
            name: true,
          },
          added_by_user: {
            id: true,
            name: true,
            email: true,
            mobile: true,
          },
          pricing: {
            id: true,
            price: true,
          },
        }
      }
    );
  }

  /**
   * get my services
   */
  async findMyService(req: Request): Promise<Subscription | null> {
    const user_id = req?.user?.sub;

    return await this.subscriptionRepository.findOne({
      where: {
        added_by: user_id,
        status: SubscriptionStatus.ACTIVE, // ✅ only active
      },
      relations: {
        service: true,
        added_by_user: true,
        pricing: true,
      },
      select: {
        id: true,
        started_at: true,
        expired_at: true,
        service: {
          id: true,
          name: true,
        },
        added_by_user: {
          id: true,
          name: true,
          email: true,
          mobile: true,
        },
        pricing: {
          id: true,
          price: true,
        },
      },
    });
  }


  update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: string) {
    return `This action removes a #${id} subscription`;
  }
}
