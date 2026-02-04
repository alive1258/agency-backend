import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';
import { BillingCycle } from './create-pricing.dto';

class GetPricingBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by service ID',
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
  })
  @IsOptional()
  @IsUUID('4', { message: 'service_id must be a valid UUID' })
  service_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by pricing category ID',
    example: '9b3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a2',
  })
  @IsOptional()
  @IsUUID('4', { message: 'pricing_category_id must be a valid UUID' })
  pricing_category_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by pricing feature ID',
    example: '7c3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a3',
  })
  @IsOptional()
  @IsUUID('4', { message: 'pricing_feature_id must be a valid UUID' })
  pricing_feature_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by billing cycle',
    enum: BillingCycle,
    example: BillingCycle.MONTHLY,
  })
  @IsOptional()
  @IsEnum(BillingCycle, { message: 'billing_cycle must be monthly or yearly' })
  billing_cycle?: BillingCycle;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active?: boolean;
}

export class GetPricingDto extends IntersectionType(
  GetPricingBaseDto,
  PaginationQueryDto,
) {}
