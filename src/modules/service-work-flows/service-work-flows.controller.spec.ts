import { Test, TestingModule } from '@nestjs/testing';
import { ServiceWorkFlowsController } from './service-work-flows.controller';
import { ServiceWorkFlowsService } from './service-work-flows.service';

describe('ServiceWorkFlowsController', () => {
  let controller: ServiceWorkFlowsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceWorkFlowsController],
      providers: [ServiceWorkFlowsService],
    }).compile();

    controller = module.get<ServiceWorkFlowsController>(ServiceWorkFlowsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
