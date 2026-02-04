import { Test, TestingModule } from '@nestjs/testing';
import { PricingCategoryService } from './pricing-category.service';

describe('PricingCategoryService', () => {
  let service: PricingCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PricingCategoryService],
    }).compile();

    service = module.get<PricingCategoryService>(PricingCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
