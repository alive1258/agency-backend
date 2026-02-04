import { PartialType } from '@nestjs/swagger';
import { CreateAssigenPricingFeatureDto } from './create-assigen-pricing-feature.dto';

export class UpdateAssigenPricingFeatureDto extends PartialType(CreateAssigenPricingFeatureDto) {}
