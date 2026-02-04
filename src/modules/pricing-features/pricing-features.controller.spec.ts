import { Test, TestingModule } from '@nestjs/testing';
import { PricingFeaturesController } from './pricing-features.controller';
import { PricingFeaturesService } from './pricing-features.service';

describe('PricingFeaturesController', () => {
  let controller: PricingFeaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricingFeaturesController],
      providers: [PricingFeaturesService],
    }).compile();

    controller = module.get<PricingFeaturesController>(PricingFeaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
