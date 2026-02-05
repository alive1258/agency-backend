import { Test, TestingModule } from '@nestjs/testing';
import { ServiceFaqsService } from './service-faqs.service';

describe('ServiceFaqsService', () => {
  let service: ServiceFaqsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceFaqsService],
    }).compile();

    service = module.get<ServiceFaqsService>(ServiceFaqsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
