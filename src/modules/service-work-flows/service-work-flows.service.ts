import { Injectable } from '@nestjs/common';
import { CreateServiceWorkFlowDto } from './dto/create-service-work-flow.dto';
import { UpdateServiceWorkFlowDto } from './dto/update-service-work-flow.dto';

@Injectable()
export class ServiceWorkFlowsService {
  create(createServiceWorkFlowDto: CreateServiceWorkFlowDto) {
    return 'This action adds a new serviceWorkFlow';
  }

  findAll() {
    return `This action returns all serviceWorkFlows`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceWorkFlow`;
  }

  update(id: number, updateServiceWorkFlowDto: UpdateServiceWorkFlowDto) {
    return `This action updates a #${id} serviceWorkFlow`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceWorkFlow`;
  }
}
