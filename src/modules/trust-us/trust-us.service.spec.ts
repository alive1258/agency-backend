import { Test, TestingModule } from '@nestjs/testing';
import { TrustUsService } from './trust-us.service';

describe('TrustUsService', () => {
  let service: TrustUsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrustUsService],
    }).compile();

    service = module.get<TrustUsService>(TrustUsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
