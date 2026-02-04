import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { User } from '../../users/entities/user.entity';
import { Pricing } from '../../pricings/entities/pricing.entity';
import {
  Subscription,
  SubscriptionStatus,
} from '../../subscriptions/entities/subscription.entity';
import {
  PaymentHistory,
  PaymentStatus,
} from '../../subscriptions/entities/payment-history.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { BillingCycle } from '../../pricings/dto/create-pricing.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly dataSource: DataSource) {}

  // 1️⃣ Initialize Payment
  async create(req: any, createPaymentDto: CreatePaymentDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userId = req?.user?.sub;
      const tran_id = uuidv4();
      const pricing = await queryRunner.manager.findOne(Pricing, {
        where: { id: createPaymentDto.pricing_id },
        relations: ['service', 'pricingCategory'],
      });
      const now = new Date();
      if (!pricing) throw new BadRequestException('Pricing not found');

      const lastSubscription = await queryRunner.manager.findOne(Subscription, {
        where: {
          added_by: userId,
          service_id: pricing.service_id,
        },
        order: { expired_at: 'DESC' },
      });

      const customerInfo = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });
      if (!customerInfo) throw new NotFoundException('User not found');

      let totalPrice = pricing.price;

      if (
        lastSubscription &&
        lastSubscription.billing_cycle === BillingCycle.MONTHLY &&
        pricing.billing_cycle === BillingCycle.YEARLY &&
        lastSubscription.expired_at > now
      ) {
        totalPrice = this.calculateProratedAmount(
          lastSubscription.price,
          pricing.price,
          lastSubscription.started_at,
        );
      }

      // Create subscription
      let billing_cycle = pricing.billing_cycle || BillingCycle.MONTHLY;
      let startedAt: Date;

      if (lastSubscription?.expired_at) {
        startedAt =
          lastSubscription.expired_at > now ? now : lastSubscription.expired_at;
      } else {
        startedAt = now;
      }
      const expiredAt = new Date(startedAt);
      if (billing_cycle === BillingCycle.MONTHLY)
        expiredAt.setMonth(expiredAt.getMonth() + 1);
      else expiredAt.setFullYear(expiredAt.getFullYear() + 1);

      const subscriptionDoc = queryRunner.manager.create(Subscription, {
        transaction_id: tran_id,
        added_by: userId,
        service_id: pricing.service_id,
        pricing_id: pricing.id,
        price: totalPrice,
        billing_cycle,
        started_at: startedAt,
        expired_at: expiredAt,
      });
      const subscription = await queryRunner.manager.save(subscriptionDoc);

      // Create Payment History
      const ipAddress =
        req.headers['x-forwarded-for']?.toString().split(',')[0] ||
        req.socket.remoteAddress ||
        '0.0.0.0';

      const paymentHistoryDoc = queryRunner.manager.create(PaymentHistory, {
        transaction_id: tran_id,
        added_by: userId,
        pricing_id: pricing.id,
        service_id: pricing.service_id,
        subscription_id: subscription.id,
        amount: totalPrice,
        gateway: 'SSL',
        status: PaymentStatus.PENDING,
        ip_address: ipAddress,
        started_at: startedAt,
        expired_at: expiredAt,
      });
      await queryRunner.manager.save(paymentHistoryDoc);

      // SSLCommerz Payload
      const payload = {
        store_id: process.env.SSLC_STORE_ID,
        store_passwd: process.env.SSLC_STORE_PASSWORD,
        total_amount: totalPrice,
        currency: 'BDT',
        tran_id,
        success_url: `${process.env.BACKEND_URL}/api/v1/payments/success`,
        fail_url: `${process.env.BACKEND_URL}/api/v1/payments/fail`,
        cancel_url: `${process.env.BACKEND_URL}/api/v1/payments/cancel`,
        cus_name: customerInfo.name || '',
        cus_email: customerInfo.email || '',
        cus_add1: customerInfo.address || '',
        cus_city: 'Dhaka',
        cus_country: 'Bangladesh',
        cus_phone: customerInfo.mobile || '',
        shipping_method: 'NO',
        product_name: pricing.service.name,
        product_category: pricing.pricingCategory.title,
        product_profile: 'general',
      };

      const sslcUrl = process.env.SSLC_PAYMENT_URL;
      if (!sslcUrl) throw new BadRequestException('SSL Payment URL not set');

      const response = await axios.post(
        sslcUrl,
        new URLSearchParams(payload as any),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      await queryRunner.commitTransaction();

      return {
        gateway_url: response.data.GatewayPageURL,
        transaction_id: tran_id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // 2️⃣ Validate Payment (Called from success callback)
  async validatePayment(val_id: string) {
    const url = `${process.env.SSLC_VALIDATION_URL}?val_id=${val_id}&store_id=${process.env.SSLC_STORE_ID}&store_passwd=${process.env.SSLC_STORE_PASSWORD}&format=json`;
    const { data } = await axios.get(url);
    return data;
  }

  // 3️⃣ Handle Success
  async handleSuccess(body: any) {
    const { val_id, tran_id, card_type, store_amount, bank_tran_id } = body;
    const validation = await this.validatePayment(val_id);

    if (validation.status !== 'VALID' && validation.status !== 'VALIDATED') {
      return { message: 'Payment validation failed', validation };
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //  Get current subscription
      const currentSubscription = await queryRunner.manager.findOne(
        Subscription,
        {
          where: { transaction_id: tran_id },
        },
      );

      if (!currentSubscription) {
        throw new NotFoundException('Subscription not found');
      }

      //  Mark payment as SUCCESS
      await queryRunner.manager.update(
        PaymentHistory,
        { transaction_id: tran_id },
        {
          status: PaymentStatus.SUCCESS,
          gateway: card_type,
          store_amount: store_amount,
          bank_tran_id: bank_tran_id,
        },
      );

      //  Inactivate ALL previous subscriptions (same user + service)
      await queryRunner.manager
        .createQueryBuilder()
        .update(Subscription)
        .set({ status: SubscriptionStatus.EXPIRED })
        .where('added_by = :userId', { userId: currentSubscription.added_by })
        .andWhere('service_id = :serviceId', {
          serviceId: currentSubscription.service_id,
        })
        .execute();

      //  Activate ONLY current subscription
      await queryRunner.manager.update(
        Subscription,
        { id: currentSubscription.id },
        { status: SubscriptionStatus.ACTIVE },
      );

      //  Update user's role to 'premium_user'
      await queryRunner.manager.update(
        User,
        { id: currentSubscription.added_by },
        { role: 'premium_user' },
      );

      await queryRunner.commitTransaction();

      return {
        message: 'Payment successful',
        transaction_id: tran_id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //  Handle Fail
  async handleFail(body: any) {
    const { tran_id } = body;
    await this.dataSource
      .getRepository(PaymentHistory)
      .update({ transaction_id: tran_id }, { status: PaymentStatus.FAILED });

    return { message: 'Payment failed' };
  }

  //  Handle Cancel
  async handleCancel(body: any) {
    const { tran_id } = body;
    await this.dataSource
      .getRepository(PaymentHistory)
      .update({ transaction_id: tran_id }, { status: PaymentStatus.CANCELLED });

    return { message: 'Payment cancelled' };
  }

  calculateProratedAmount(
    monthlyPrice: number,
    yearlyPrice: number,
    startedAt: Date,
  ) {
    const now = new Date();

    const totalDaysInMonth = new Date(
      startedAt.getFullYear(),
      startedAt.getMonth() + 1,
      0,
    ).getDate();

    const usedDays = Math.max(
      Math.ceil((now.getTime() - startedAt.getTime()) / (1000 * 60 * 60 * 24)),
      0,
    );

    const perDayPrice = monthlyPrice / totalDaysInMonth;
    const usedAmount = perDayPrice * usedDays;
    const remainingAmount = Math.max(monthlyPrice - usedAmount, 0);

    return Math.max(yearlyPrice - remainingAmount, 0);
  }
}
