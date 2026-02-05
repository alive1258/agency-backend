import { Module } from '@nestjs/common';
import { WhyChooseUsService } from './why-choose-us.service';
import { WhyChooseUsController } from './why-choose-us.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhyChooseUs } from './entities/why-choose-us.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WhyChooseUs])],
  controllers: [WhyChooseUsController],
  providers: [WhyChooseUsService],
  exports: [WhyChooseUsService],
})
export class WhyChooseUsModule {}
