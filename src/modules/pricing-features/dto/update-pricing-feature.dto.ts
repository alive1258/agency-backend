import { PartialType } from '@nestjs/swagger';
import { CreatePricingFeatureDto } from './create-pricing-feature.dto';

export class UpdatePricingFeatureDto extends PartialType(CreatePricingFeatureDto) {}
