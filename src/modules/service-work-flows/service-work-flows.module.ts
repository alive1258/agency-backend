import { Module } from '@nestjs/common';
import { ServiceWorkFlowsService } from './service-work-flows.service';
import { ServiceWorkFlowsController } from './service-work-flows.controller';

@Module({
  controllers: [ServiceWorkFlowsController],
  providers: [ServiceWorkFlowsService],
})
export class ServiceWorkFlowsModule {}
