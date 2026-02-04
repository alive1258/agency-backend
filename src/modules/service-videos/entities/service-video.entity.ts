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

@Entity('service_videos') // 
@Index('IDX_SERVICE_VIDEO_SERVICE', ['service_id'])
@Index('IDX_SERVICE_VIDEO_TITLE', ['title'])
export class ServiceVideo {
  /**
   * Primary UUID
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Related Service UUID
   */
  @Column({ type: 'uuid', nullable: false })
  service_id: string;

  @ManyToOne(() => Service, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  /**
   * User who added this video
   */
  @Column({ type: 'bigint', nullable: false })
  added_by: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'added_by' })
  addedBy: User;

  /**
   * Video Title
   */
  @Column({ type: 'varchar', length: 150 })
  title: string;

  /**
   * Description
   */
  @Column({ type: 'text' })
  description: string;

  /**
   * Thumbnail image URL
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail?: string;

  /**
   * Video URL
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  video_url?: string;

  /**
   * Active status
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
