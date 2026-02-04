import { Test, TestingModule } from '@nestjs/testing';
import { PricingCategoryController } from './pricing-category.controller';
import { PricingCategoryService } from './pricing-category.service';

describe('PricingCategoryController', () => {
  let controller: PricingCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricingCategoryController],
      providers: [PricingCategoryService],
    }).compile();

    controller = module.get<PricingCategoryController>(PricingCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
