import { Module } from '@nestjs/common';
import { PricingCategoryService } from './pricing-category.service';
import { PricingCategoryController } from './pricing-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingCategory } from './entities/pricing-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PricingCategory])],
  controllers: [PricingCategoryController],
  providers: [PricingCategoryService],
  exports: [PricingCategoryService],
})
export class PricingCategoryModule {}
