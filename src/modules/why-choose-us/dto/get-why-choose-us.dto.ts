import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetWhyChooseUsBaseDto {
  @ApiPropertyOptional({
    description:
      'Filter Why Choose Us records by headline (partial match supported).',
    example: 'Trusted',
  })
  @IsOptional()
  @IsString({ message: 'Headline must be a string.' })
  headline?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean value.' })
  is_active?: boolean;
}

export class GetWhyChooseUsDto extends IntersectionType(
  GetWhyChooseUsBaseDto,
  PaginationQueryDto,
) {}
