import { Test, TestingModule } from '@nestjs/testing';
import { PricingFeaturesService } from './pricing-features.service';

describe('PricingFeaturesService', () => {
  let service: PricingFeaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PricingFeaturesService],
    }).compile();

    service = module.get<PricingFeaturesService>(PricingFeaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
