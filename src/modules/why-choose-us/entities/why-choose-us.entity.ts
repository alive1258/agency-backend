import { Service } from 'src/modules/services/entities/service.entity';
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

@Entity('why-choose-us')
@Index(['headline'])
export class WhyChooseUs {
  /**
   * Primary key ID (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Headline text
   */
  @Column({ type: 'varchar', nullable: false })
  headline: string;
  /**
   * Headline text
   */
  @Column({ type: 'varchar', nullable: false })
  description: string;

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
   * Related service ID
   */
  @Column({ type: 'uuid', nullable: false })
  service_id: string;

  @ManyToOne(() => Service, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: Service;

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
