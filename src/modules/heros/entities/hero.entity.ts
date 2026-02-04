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

@Entity('heroes')
@Index('IDX_HERO_TITLE', ['title'])
@Index('IDX_HERO_COMPANY', ['company'])
export class Hero {
  /**
   * Primary key UUID
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Hero title
   */
  @Column({ type: 'varchar', length: 150, nullable: false })
  title: string;

  /**
   * Hero description
   */
  @Column({ type: 'text', nullable: false })
  description: string;

  /**
   * Company name
   */
  @Column({ type: 'varchar', length: 150, nullable: false })
  company: string;

  /**
   * Performance score
   */
  @Column({ type: 'int', default: 0 })
  score: number;

  /**
   * Rating (0–5)
   */
  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  /**
   * Hero image URL (optional)
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string;

  /**
   * Hero video URL (optional)
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  videoUrl?: string;

  /**
   * Number of campaigns (optional)
   */
  @Column({ type: 'int', default: 0 })
  campaigns?: number;

  /**
   * Revenue generated (optional)
   */
  @Column({ type: 'bigint', default: 0 })
  revenue?: number;

  /**
   * User ID who added this entry
   */
  @Column({ type: 'bigint', nullable: false })
  added_by: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'added_by' })
  addedBy: User;

      /**
   * Is the record active (for soft delete or deactivation)
   */
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

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
