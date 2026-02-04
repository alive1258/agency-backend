import { Test, TestingModule } from '@nestjs/testing';
import { AssigenPricingFeaturesController } from './assigen-pricing-features.controller';
import { AssigenPricingFeaturesService } from './assigen-pricing-features.service';

describe('AssigenPricingFeaturesController', () => {
  let controller: AssigenPricingFeaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssigenPricingFeaturesController],
      providers: [AssigenPricingFeaturesService],
    }).compile();

    controller = module.get<AssigenPricingFeaturesController>(AssigenPricingFeaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
