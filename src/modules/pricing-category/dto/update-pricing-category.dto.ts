import { PartialType } from '@nestjs/swagger';
import { CreatePricingCategoryDto } from './create-pricing-category.dto';

export class UpdatePricingCategoryDto extends PartialType(CreatePricingCategoryDto) {}
