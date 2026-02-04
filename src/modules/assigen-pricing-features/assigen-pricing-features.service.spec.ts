import { Test, TestingModule } from '@nestjs/testing';
import { AssigenPricingFeaturesService } from './assigen-pricing-features.service';

describe('AssigenPricingFeaturesService', () => {
  let service: AssigenPricingFeaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssigenPricingFeaturesService],
    }).compile();

    service = module.get<AssigenPricingFeaturesService>(AssigenPricingFeaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
