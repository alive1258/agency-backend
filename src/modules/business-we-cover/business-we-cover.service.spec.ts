import { Test, TestingModule } from '@nestjs/testing';
import { BusinessWeCoverService } from './business-we-cover.service';

describe('BusinessWeCoverService', () => {
  let service: BusinessWeCoverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessWeCoverService],
    }).compile();

    service = module.get<BusinessWeCoverService>(BusinessWeCoverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
