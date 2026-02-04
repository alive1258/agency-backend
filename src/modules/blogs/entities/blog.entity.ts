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

@Entity('blogs')
@Index('IDX_BLOG_TITLE', ['title'])
@Index('IDX_BLOG_CATEGORY', ['blog_category_id'])
export class Blog {
  /**
   * Primary key UUID
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Service name
   */
  @Column({ type: 'varchar', length: 150, nullable: false })
  title: string;

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
  blog_category_id: string;

  @ManyToOne(() => Category, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'blog_category_id' })
  blog_category: Category;

  //   @OneToMany(() => WhyChooseUs, (log) => log.blog, {
  //     cascade: true,
  //   })
  //   why_choose_us: WhyChooseUs[];

  //   @OneToMany(() => BusinessWeCover, (log) => log.blog, {
  //     cascade: true,
  //   })
  //   business_we_cover: BusinessWeCover[];

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
   * Service rating (0–5)
   */
  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  /**
   * Service image URL (optional)
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string;

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
