import { Service } from 'src/modules/services/entities/service.entity';
import { ServiceVideo } from 'src/modules/service-videos/entities/service-video.entity';
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

@Entity('service_reviews')

export class ServiceReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Related Service */
  @Column({ type: 'uuid' })
  service_id: string;

  @ManyToOne(() => Service, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  /** Related Video */
  @Column({ type: 'uuid' })
  service_video_id: string;

  @ManyToOne(() => ServiceVideo, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_video_id' })
  service_video: ServiceVideo;

  /** User who added review */
  @Column({ type: 'bigint' })
  added_by: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'added_by' })
  addedBy: User;

  /** Rating (1–5) */
  @Column({ type: 'int' })
  rating: number;

  /** Review message */
  @Column({ type: 'text' })
  message: string;

  /** Active status */
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at?: Date;
}
