import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetPricingCategoryBaseDto {
  @ApiPropertyOptional({
    description:
      'Filter pricing categories by title (partial match supported).',
    example: 'Enterprise Plan',
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean value.' })
  is_active?: boolean;
}

export class GetPricingCategoryDto extends IntersectionType(
  GetPricingCategoryBaseDto,
  PaginationQueryDto,
) {}
