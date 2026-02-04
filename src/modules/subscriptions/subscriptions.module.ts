import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentHistory } from './entities/payment-history.entity';
import { Subscription } from './entities/subscription.entity';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  imports: [TypeOrmModule.forFeature([PaymentHistory, Subscription])],
  exports: [SubscriptionsService, TypeOrmModule],
})
export class SubscriptionsModule {}
