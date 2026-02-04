import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetCategoryBaseDto {
  @ApiPropertyOptional({
    description: 'Filter categories by name.',
    example: 'Technology',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  name?: string;
}

export class GetCategoryDto extends IntersectionType(
  GetCategoryBaseDto,
  PaginationQueryDto,
) {}
