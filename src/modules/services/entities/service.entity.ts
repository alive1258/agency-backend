import { BusinessWeCover } from 'src/modules/business-we-cover/entities/business-we-cover.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { WhyChooseUs } from 'src/modules/why-choose-us/entities/why-choose-us.entity';
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

@Entity('services')
@Index('IDX_SERVICE_NAME', ['name'])
@Index('IDX_SERVICE_CATEGORY', ['category_id'])
export class Service {
  /**
   * Primary key UUID
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Service name
   */
  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  /**
   * User ID who added this entry
   */
  @Column({ type: 'bigint', nullable: false })
  added_by: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'added_by' })
  addedBy: User;

  /**
   * Foreign key: Category
   */
  @Column({ type: 'uuid', nullable: false })
  category_id: string;

  @ManyToOne(() => Category, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => WhyChooseUs, (log) => log.service, {
    cascade: true,
  })
  why_choose_us: WhyChooseUs[];

  @OneToMany(() => BusinessWeCover, (log) => log.service, {
    cascade: true,
  })
  business_we_cover: BusinessWeCover[];

  /**
   * Service description
   */
  @Column({ type: 'text', nullable: false })
  description: string;

  /**
   * Key features (optional)
   */
  @Column({ type: 'text', nullable: true })
  key_features?: string;

  /**
   * Number of companies using this service
   */
  @Column({ type: 'int', default: 0 })
  used_by_companies: number;

  /**
   * Landing page URL (optional)
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  landing_page?: string;

  /**
   * Service rating (0–5)
   */
  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  /**
   * Available districts (optional)
   */
  @Column({ type: 'text', nullable: true })
  districts?: string;

  /**
   * Service image URL (optional)
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string;

  /**
   * Promotional video URL (optional)
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  video_url?: string;

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
