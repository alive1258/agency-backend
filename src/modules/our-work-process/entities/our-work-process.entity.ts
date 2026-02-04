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

@Entity('our_work_processes')
@Index('IDX_OUR_WORK_PROCESS_NAME', ['title'])
export class OurWorkProcess {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'text', nullable: true })
  color_code?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string;

  @Column({ type: 'bigint', nullable: false })
  added_by: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'added_by' })
  addedBy: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at?: Date;
}
