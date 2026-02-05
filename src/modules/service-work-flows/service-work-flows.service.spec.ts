import { Test, TestingModule } from '@nestjs/testing';
import { ServiceWorkFlowsService } from './service-work-flows.service';

describe('ServiceWorkFlowsService', () => {
  let service: ServiceWorkFlowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceWorkFlowsService],
    }).compile();

    service = module.get<ServiceWorkFlowsService>(ServiceWorkFlowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
