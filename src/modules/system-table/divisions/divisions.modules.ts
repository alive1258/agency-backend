import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DivisionController } from './divisions.controller';
import { DivisionService } from './divisions.service';
import { DivisionEntity } from './entities/divisions.entity';
import { DistrictEntity } from '../districts/entities/districts.entity';

@Module({
  controllers: [DivisionController],
  providers: [DivisionService],
  imports: [TypeOrmModule.forFeature([DistrictEntity,DivisionEntity])],
  exports: [DivisionService],
})
export class DivisionModule {}
