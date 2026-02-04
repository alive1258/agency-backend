import { Pricing } from 'src/modules/pricings/entities/pricing.entity';
import { Service } from 'src/modules/services/entities/service.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BillingCycle } from '../../pricings/dto/create-pricing.dto';
import { PaymentHistory } from './payment-history.entity';
export enum SubscriptionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, unique: true })
  transaction_id: string;

  @Column({
    type: 'enum',
    enum: BillingCycle,
    default: BillingCycle.MONTHLY,
  })
  billing_cycle: BillingCycle;

  /**
   * Added by user
   */
  @Column({ type: 'bigint', nullable: false })
  added_by: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'added_by' })
  added_by_user: User;

  /**
   * Service
   */
  @Column({ type: 'uuid', nullable: false })
  service_id: string;

  @ManyToOne(() => Service, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ type: 'uuid', nullable: true })
  payment_id: string;

  @ManyToOne(() => PaymentHistory, { nullable: true })
  @JoinColumn({ name: 'payment_id' })
  payments: PaymentHistory;

  /**
   * Pricing
   */
  @Column({ type: 'uuid', nullable: false })
  pricing_id: string;

  @ManyToOne(() => Pricing, { nullable: false })
  @JoinColumn({ name: 'pricing_id' })
  pricing: Pricing;

  /**
   * Price
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  /**
   * Subscription Status
   */
  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.PENDING,
  })
  status: SubscriptionStatus;

  /**
   * Started Date
   */
  @Column({ type: 'timestamp', nullable: true })
  started_at: Date;

  /**
   * Expired Date
   */
  @Column({ type: 'timestamp', nullable: false })
  expired_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
