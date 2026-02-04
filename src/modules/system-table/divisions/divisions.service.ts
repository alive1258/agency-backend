import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DivisionEntity } from './entities/divisions.entity';

@Injectable()
export class DivisionService implements OnModuleInit {
  constructor(
    @InjectRepository(DivisionEntity)
    private readonly divisionRepository: Repository<DivisionEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    const divisions: DivisionEntity[] = [
      { id: 1, name: 'Dhaka' } as DivisionEntity,
      { id: 2, name: 'Chattogram' } as DivisionEntity,
      { id: 3, name: 'Rajshahi' } as DivisionEntity,
      { id: 4, name: 'Khulna' } as DivisionEntity,
      { id: 5, name: 'Barishal' } as DivisionEntity,
      { id: 6, name: 'Sylhet' } as DivisionEntity,
      { id: 7, name: 'Rangpur' } as DivisionEntity,
      { id: 8, name: 'Mymensingh' } as DivisionEntity,
    ];

    const existing = await this.divisionRepository.find({
      select: ['id'],
    });

    const existingIds = new Set(existing.map(d => d.id));

    const newDivisions = divisions.filter(d => !existingIds.has(d.id));

    if (newDivisions.length) {
      await this.divisionRepository.save(newDivisions);
      console.log('✅ Divisions seeded');
    }
  }

  async findAll(): Promise<DivisionEntity[]> {
    return this.divisionRepository.find({
      order: { name: 'ASC' },
    });
  }
}
