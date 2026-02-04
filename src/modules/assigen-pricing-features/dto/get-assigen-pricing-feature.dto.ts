import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetAssignPricingFeatureBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by pricing UUID',
    example: '1f2c3d4e-5a6b-7c8d-9e10-abcdef123456',
  })
  @IsOptional()
  @IsUUID('4', { message: 'pricing_id must be a valid UUID' })
  pricing_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by pricing feature UUID',
    example: '9e8d7c6b-5a4f-3e2d-1c0b-fedcba654321',
  })
  @IsOptional()
  @IsUUID('4', { message: 'pricing_features_id must be a valid UUID' })
  pricing_features_id?: string;
}

/**
 * GetAssignPricingFeatureDto
 * Combines base filters with pagination
 */
export class GetAssignPricingFeatureDto extends IntersectionType(
  GetAssignPricingFeatureBaseDto,
  PaginationQueryDto,
) {}
