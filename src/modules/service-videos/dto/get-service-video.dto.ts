import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetServiceVideoBaseDto {

  /** Title */
  @ApiPropertyOptional({
    description: 'Title of the ServiceVideo',
    example: 'Facebook Ads Manager Overview',
  })
  @IsString()
  @IsOptional()
  title: string;

  /** Title */
  @ApiPropertyOptional({
    description: 'Filter by category UUID',
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
  })
  @IsOptional()
  @IsUUID('4', { message: 'category_id must be a valid UUID' })
 
  service_id: string;

  /** Description */
  @ApiPropertyOptional({
    description: 'Detailed description of the ServiceVideo',
    example: 'Comprehensive walkthrough of Facebook Ads Manager',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class GetServiceVideoDto extends IntersectionType(
  GetServiceVideoBaseDto,
  PaginationQueryDto,
) {}
