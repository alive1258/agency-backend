import { PartialType } from '@nestjs/swagger';
import { CreateServiceWorkFlowDto } from './create-service-work-flow.dto';

export class UpdateServiceWorkFlowDto extends PartialType(CreateServiceWorkFlowDto) {}
