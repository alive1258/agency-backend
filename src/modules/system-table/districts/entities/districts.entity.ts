import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { DivisionEntity } from '../../divisions/entities/divisions.entity';

@Entity({ name: 'districts' })
@Index(['name', 'division'], { unique: true })
export class DistrictEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @ManyToOne(() => DivisionEntity, (division) => division.districts, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'division_id' })
  division: DivisionEntity;
}

