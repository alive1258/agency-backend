import { Entity, PrimaryColumn, Column, OneToMany, Index } from 'typeorm';
import { DistrictEntity } from '../../districts/entities/districts.entity';

@Entity({ name: 'divisions' })
export class DivisionEntity {
  @PrimaryColumn({ type: 'int' }) // ✅ Fixed numeric ID
  id: number;

  @Index({ unique: true }) // ✅ Faster lookup + DB-level protection
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => DistrictEntity, (district) => district.division)
  districts: DistrictEntity[];
}
