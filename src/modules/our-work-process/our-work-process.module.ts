import { Module } from '@nestjs/common';
import { OurWorkProcessService } from './our-work-process.service';
import { OurWorkProcessController } from './our-work-process.controller';

@Module({
  controllers: [OurWorkProcessController],
  providers: [OurWorkProcessService],
})
export class OurWorkProcessModule {}
