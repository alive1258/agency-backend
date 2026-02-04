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

@Entity('blog-categories')
@Index(['name'])
export class BlogCategory {
  /**
   * Primary key ID (auto-incremented bigint)
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Hero section name
   */
  @Column({ type: 'varchar', nullable: false })
  name: string;

  /**
   * User ID who added this entry
   */
  @Column({ type: 'bigint', nullable: false })
  added_by: string;

  @ManyToOne(() => User, {
    nullable: false,
  })
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

  // Soft delete column
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at?: Date;
}
