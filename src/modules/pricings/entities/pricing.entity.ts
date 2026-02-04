import { User } from 'src/modules/users/entities/user.entity';

import { Service } from 'src/modules/services/entities/service.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BillingCycle } from '../dto/create-pricing.dto';
import { PricingCategory } from 'src/modules/pricing-category/entities/pricing-category.entity';
import { PricingFeature } from 'src/modules/pricing-features/entities/pricing-feature.entity';
import { AssigenPricingFeature } from 'src/modules/assigen-pricing-features/entities/assigen-pricing-feature.entity';

@Entity('pricing')
@Index('IDX_PRICING_SERVICE', ['service_id'])
@Index('IDX_PRICING_CATEGORY', ['pricing_category_id'])
@Index('IDX_PRICING_SERVICE_CATEGORY', ['service_id', 'pricing_category_id'])
@Index(
  'UQ_PRICING_COMBO',
  ['service_id', 'pricing_category_id', 'billing_cycle'],
  { unique: true },
)
export class Pricing {
  /**
   * Primary key ID (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Associated service ID
   */
  @Column({ type: 'uuid', nullable: false })
  service_id: string;

  @ManyToOne(() => Service, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  /**
   * Associated pricing category ID
   */
  @Column({ type: 'uuid', nullable: false })
  pricing_category_id: string;

  @ManyToOne(() => PricingCategory, { nullable: false })
  @JoinColumn({ name: 'pricing_category_id' })
  pricingCategory: PricingCategory;

  /**
   * Price for this combination
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  /**
   * Discount for this pricing (optional)
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount?: number;

  /**
   * Billing cycle (monthly/yearly)
   */
  @Column({ type: 'enum', enum: BillingCycle })
  billing_cycle: BillingCycle; // ✅ ADD THIS

  @OneToMany(() => AssigenPricingFeature, (log) => log.pricing, {
    cascade: true,
  })
  assigen_pricing_feature: AssigenPricingFeature[];

  /**
   * Is the record active
   */
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  /**
   * User ID who added this entry
   */
  @Column({ type: 'bigint', nullable: false })
  added_by: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'added_by' })
  addedBy: User;

  /**
   * Timestamp when the record was created
   */
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  /**
   * Timestamp when the record was last updated
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  /**
   * Soft delete column
   */
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at?: Date;
}
