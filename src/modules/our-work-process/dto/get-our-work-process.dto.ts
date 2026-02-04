import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetOurWorkProcessBaseDto {
  @ApiPropertyOptional({
    description:
      'Filter our work processes by title (partial match supported).',
    example: 'Web Development',
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  title?: string;
  @ApiPropertyOptional({
    description:
      'Filter our work processes by title (partial match supported).',
    example: 'Web Development',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean value.' })
  is_active?: boolean;
}

export class GetOurWorkProcessDto extends IntersectionType(
  GetOurWorkProcessBaseDto,
  PaginationQueryDto,
) {}
