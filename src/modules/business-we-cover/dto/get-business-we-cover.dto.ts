import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetBusinessWeCoverBaseDto {
  @ApiPropertyOptional({
    description:
      'Filter business categories by name (partial match supported).',
    example: 'Technology',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  name?: string;
  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean value.' })
  is_active?: boolean;
}

export class GetBusinessWeCoverDto extends IntersectionType(
  GetBusinessWeCoverBaseDto,
  PaginationQueryDto,
) {}
