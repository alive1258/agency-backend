import { Test, TestingModule } from '@nestjs/testing';
import { WhyChooseUsService } from './why-choose-us.service';

describe('WhyChooseUsService', () => {
  let service: WhyChooseUsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhyChooseUsService],
    }).compile();

    service = module.get<WhyChooseUsService>(WhyChooseUsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
