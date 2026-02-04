import { Module } from '@nestjs/common';
import { AssigenPricingFeaturesService } from './assigen-pricing-features.service';
import { AssigenPricingFeaturesController } from './assigen-pricing-features.controller';
import { Pricing } from '../pricings/entities/pricing.entity';
import { PricingFeature } from '../pricing-features/entities/pricing-feature.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssigenPricingFeature } from './entities/assigen-pricing-feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssigenPricingFeature,PricingFeature, Pricing])],
  controllers: [AssigenPricingFeaturesController],
  providers: [AssigenPricingFeaturesService],
  exports: [AssigenPricingFeaturesService],
})
export class AssigenPricingFeaturesModule {}
