import { Test, TestingModule } from '@nestjs/testing';
import { ServiceFaqsController } from './service-faqs.controller';
import { ServiceFaqsService } from './service-faqs.service';

describe('ServiceFaqsController', () => {
  let controller: ServiceFaqsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceFaqsController],
      providers: [ServiceFaqsService],
    }).compile();

    controller = module.get<ServiceFaqsController>(ServiceFaqsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
