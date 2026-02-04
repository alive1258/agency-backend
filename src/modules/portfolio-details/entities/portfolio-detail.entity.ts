import { Blog } from 'src/modules/blogs/entities/blog.entity';
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

@Entity('portfolio_details')
@Index('IDX_PORTFOLIO_DETAIL_TITLE', ['title'])
@Index('IDX_PORTFOLIO_DETAIL_CATEGORY', ['portfolio_id'])
export class PortfolioDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  title: string;

  @Column({ type: 'bigint', nullable: false })
  added_by: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'added_by' })
  addedBy: User;

  @Column({ type: 'uuid', nullable: false })
  blog_id: string;

  @ManyToOne(() => Blog, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'text', nullable: true })
  key_features?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at?: Date;
}
