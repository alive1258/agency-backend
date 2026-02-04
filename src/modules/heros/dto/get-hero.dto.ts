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

class GetHeroBaseDto {
   @ApiPropertyOptional({
    description: 'Filter by hero title (partial match)',
    example: 'Digital Solutions',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by hero description (partial match)',
    example: 'modern technology',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Filter by company name',
    example: 'Tech Corp',
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class GetHeroDto extends IntersectionType(
  GetHeroBaseDto,
  PaginationQueryDto,
) {}
