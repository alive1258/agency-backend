import { Module } from '@nestjs/common';
import { ServiceFaqsService } from './service-faqs.service';
import { ServiceFaqsController } from './service-faqs.controller';

@Module({
  controllers: [ServiceFaqsController],
  providers: [ServiceFaqsService],
})
export class ServiceFaqsModule {}
