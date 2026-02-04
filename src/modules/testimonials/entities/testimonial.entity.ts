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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('testimonials')
@Index('IDX_TESTIMONIAL_NAME', ['name'])
@Index('IDX_TESTIMONIAL_DESIGNATION', ['designation'])
export class Testimonial {
  /**
   * Primary key UUID
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Client name
   */
  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  /**
   * Client designation
   */
  @Column({ type: 'varchar', length: 150, nullable: false })
  designation: string;

  /**
   * Client image URL (optional)
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string;

  /**
   * Testimonial description
   */
  @Column({ type: 'text', nullable: false })
  description: string;

  /**
   * Client rating (0–5)
   */
  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  /**
   * Related service UUID
   */
  @Column({ type: 'uuid', nullable: false })
  service_id: string;

  @ManyToOne(() => Service, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  /**
   * Revenue generated (optional)
   */
  @Column({ type: 'bigint', default: 0 })
  revenueGenerated?: number;

  /**
   * Performance score (optional)
   */
  @Column({ type: 'int', default: 0 })
  performance?: number;

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
   * Creation timestamp
   */
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  /**
   * Last update timestamp
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  /**
   * Soft delete timestamp
   */
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at?: Date;
}
