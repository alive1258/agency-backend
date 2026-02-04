import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SubscriptionsModule } from '../../subscriptions/subscriptions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentHistory } from '../../subscriptions/entities/payment-history.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

@Module({
  controllers: [PaymentsController],
  imports: [
    TypeOrmModule.forFeature([PaymentHistory, Subscription]),
    SubscriptionsModule,
  ],
  providers: [PaymentsService],
})
export class PaymentsModule {}
