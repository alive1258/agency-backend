import { PricingFeature } from 'src/modules/pricing-features/entities/pricing-feature.entity';
import { Pricing } from 'src/modules/pricings/entities/pricing.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('assigen_pricing_features')
export class AssigenPricingFeature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Foreign key: Pricing
   */
  @Column({ type: 'uuid', nullable: false })
  pricing_id: string;

  @ManyToOne(() => Pricing, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'pricing_id' })
  pricing: Pricing;

  

  /**
   * Foreign key: Pricing Feature
   */
  @Column({ type: 'uuid', nullable: false })
  pricing_features_id: string;

  @ManyToOne(() => PricingFeature, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'pricing_features_id' })
  pricing_feature: PricingFeature;

   /**
   * User ID who added this entry
   */
  @Column({ type: 'bigint', nullable: false })
  added_by: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'added_by' })
  addedBy: User;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at?: Date;
}
