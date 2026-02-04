import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistrictEntity } from './entities/districts.entity';
import { DivisionEntity } from '../divisions/entities/divisions.entity';

@Injectable()
export class DistrictService implements OnModuleInit {
  constructor(
    @InjectRepository(DistrictEntity)
    private readonly districtRepository: Repository<DistrictEntity>,

     @InjectRepository(DivisionEntity)
    private readonly divisionRepository: Repository<DivisionEntity>,
  ) {}

  /**
   * Seed static Bangladesh district data
   */
  async onModuleInit(): Promise<void> {
      const districtMap = [
      {id: 1, division: 'Dhaka', names: ['Dhaka','Gazipur','Narayanganj','Narsingdi','Manikganj','Munshiganj','Tangail','Kishoreganj','Faridpur','Gopalganj','Madaripur','Rajbari','Shariatpur'] },
      {id: 2, division: 'Chattogram', names: ['Chattogram','Cox’s Bazar','Cumilla','Noakhali','Feni','Lakshmipur','Brahmanbaria','Chandpur','Khagrachari','Rangamati','Bandarban'] },
      {id: 3, division: 'Rajshahi', names: ['Rajshahi','Natore','Naogaon','Chapainawabganj','Bogura','Joypurhat','Sirajganj','Pabna'] },
      {id: 4, division: 'Khulna', names: ['Khulna','Jessore','Satkhira','Bagerhat','Jhenaidah','Narail','Magura','Kushtia','Chuadanga','Meherpur'] },
      {id: 5, division: 'Barishal', names: ['Barishal','Bhola','Patuakhali','Pirojpur','Jhalokathi','Barguna'] },
      {id: 6, division: 'Sylhet', names: ['Sylhet','Moulvibazar','Habiganj','Sunamganj'] },
      {id: 7, division: 'Rangpur', names: ['Rangpur','Dinajpur','Thakurgaon','Panchagarh','Nilphamari','Lalmonirhat','Kurigram','Gaibandha'] },
      {id: 8, division: 'Mymensingh', names: ['Mymensingh','Jamalpur','Sherpur','Netrokona'] },
    ];

      const divisions = await this.divisionRepository.find();
    const divisionMap = new Map(divisions.map(d => [d.name, d]));

    const existingDistricts = await this.districtRepository.find({ relations: ['division'] });
    const existingSet = new Set(existingDistricts.map(d => `${d.name}-${d.division.id}`));

    const newDistricts: DistrictEntity[] = [];

       for (const group of districtMap) {
      const division = divisionMap.get(group.division);
      if (!division) continue;

      for (const name of group.names) {
        const key = `${name}-${division.id}`;
        if (!existingSet.has(key)) {
          const district = this.districtRepository.create({ name, division });
          newDistricts.push(district);
        }
      }
    }

      if (newDistricts.length) {
      await this.districtRepository.save(newDistricts);
      console.log('✅ Districts seeded');
    }
  }

  /**
   * Get all districts
   */
   async findAll(): Promise<DistrictEntity[]> {
    return this.districtRepository.find({
      relations: ['division'],
      order: { name: 'ASC' },
    });
  }
}
