import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetBlogBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by service name (partial match)',
    example: 'Web Development',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by category UUID',
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
  })
  @IsOptional()
  @IsUUID('4', { message: 'blog_category_id must be a valid UUID' })
  blog_category_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class GetBlogDto extends IntersectionType(
  GetBlogBaseDto,
  PaginationQueryDto,
) {}
