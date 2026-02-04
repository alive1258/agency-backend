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

class GetServiceBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by service name (partial match)',
    example: 'Web Development',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by category UUID',
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
  })
  @IsOptional()
  @IsUUID('4', { message: 'category_id must be a valid UUID' })
  category_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by district (comma separated or partial)',
    example: 'Dhaka, Chittagong',
  })
  @IsOptional()
  @IsString()
  districts?: string;

  @ApiPropertyOptional({
    description: 'Filter by minimum rating',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  min_rating?: number;

  @ApiPropertyOptional({
    description: 'Filter by maximum rating',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  max_rating?: number;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class GetServiceDto extends IntersectionType(
  GetServiceBaseDto,
  PaginationQueryDto,
) {}
