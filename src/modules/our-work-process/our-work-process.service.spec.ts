import { Test, TestingModule } from '@nestjs/testing';
import { OurWorkProcessService } from './our-work-process.service';

describe('OurWorkProcessService', () => {
  let service: OurWorkProcessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OurWorkProcessService],
    }).compile();

    service = module.get<OurWorkProcessService>(OurWorkProcessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
