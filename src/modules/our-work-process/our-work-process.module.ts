import { Module } from '@nestjs/common';
import { OurWorkProcessService } from './our-work-process.service';
import { OurWorkProcessController } from './our-work-process.controller';
import { OurWorkProcess } from './entities/our-work-process.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OurWorkProcess])],
  controllers: [OurWorkProcessController],
  providers: [OurWorkProcessService],
  exports: [OurWorkProcessService],
})
export class OurWorkProcessModule {}
