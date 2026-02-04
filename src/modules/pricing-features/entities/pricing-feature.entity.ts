import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pricing_feature')
@Index(['title'])
export class PricingFeature {
  /**
   * Primary key ID (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Title of the pricing feature
   */
  @Column({ type: 'varchar', nullable: false })
  title: string;

  /**
   * Is the record active (for soft delete or deactivation)
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
