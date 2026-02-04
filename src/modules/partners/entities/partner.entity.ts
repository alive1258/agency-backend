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

@Entity('partners')
@Index('IDX_PARTNER_NAME', ['name'])
export class Partner {
  /**
   * Primary key UUID
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Partner name
   */
  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  /**
   * Partner image URL (optional)
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string;

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
