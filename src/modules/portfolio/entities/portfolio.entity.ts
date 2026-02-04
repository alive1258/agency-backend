import { PortfolioCategory } from 'src/modules/portfolio-categories/entities/portfolio-category.entity';
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

@Entity('portfolios')
@Index('IDX_PORTFOLIO_TITLE', ['title'])
@Index('IDX_PORTFOLIO_CATEGORY', ['portfolio_category_id'])
export class Portfolio {
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
  portfolio_category_id: string;

  @ManyToOne(() => PortfolioCategory, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'portfolio_category_id' })
  portfolio_category: PortfolioCategory;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'text', nullable: true })
  company_name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at?: Date;
}
