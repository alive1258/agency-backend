import { Module } from '@nestjs/common';
import { BusinessWeCoverService } from './business-we-cover.service';
import { BusinessWeCoverController } from './business-we-cover.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessWeCover } from './entities/business-we-cover.entity';
import { Service } from '../services/entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessWeCover, Service])],
  controllers: [BusinessWeCoverController],
  providers: [BusinessWeCoverService],
  exports: [BusinessWeCoverService],
})
export class BusinessWeCoverModule {}
