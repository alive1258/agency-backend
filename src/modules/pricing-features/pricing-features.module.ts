import { Module } from '@nestjs/common';
import { PricingFeaturesService } from './pricing-features.service';
import { PricingFeaturesController } from './pricing-features.controller';
import { PricingFeature } from './entities/pricing-feature.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PricingFeature])],
  controllers: [PricingFeaturesController],
  providers: [PricingFeaturesService],
  exports: [PricingFeaturesService],
})
export class PricingFeaturesModule {}
