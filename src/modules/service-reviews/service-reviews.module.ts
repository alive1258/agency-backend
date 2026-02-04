import { Module } from '@nestjs/common';
import { ServiceReviewsService } from './service-reviews.service';
import { ServiceReviewsController } from './service-reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../services/entities/service.entity';
import { ServiceVideo } from '../service-videos/entities/service-video.entity';
import { ServiceReview } from './entities/service-review.entity';
import { PaymentHistory } from '../subscriptions/entities/payment-history.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Service,
      ServiceVideo,
      ServiceReview,
      PaymentHistory,
      User,
    ]),
  ],
  controllers: [ServiceReviewsController],
  providers: [ServiceReviewsService],
  exports: [ServiceReviewsService],
})
export class ServiceReviewsModule {}
