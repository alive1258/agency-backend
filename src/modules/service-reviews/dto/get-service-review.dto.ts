import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetServiceReviewBaseDto {
  /** Description */
  @ApiPropertyOptional({
    description: 'Detailed description of the ServiceReview',
    example: 'Comprehensive walkthrough of Facebook Ads Manager',
  })
  @IsString()
  @IsOptional()
  massage: string;

  @ApiPropertyOptional({
    description: 'Filter by category UUID',
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
  })
  @IsOptional()
  @IsUUID('4', { message: 'category_id must be a valid UUID' })
  service_id: string;

  @ApiPropertyOptional({
    description: 'Filter by category UUID',
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
  })
  @IsOptional()
  @IsUUID('4', { message: 'category_id must be a valid UUID' })

  service_video_id: string;
  @ApiPropertyOptional({
    description: 'Filter by category UUID',
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
  })
  @IsOptional()
  @IsUUID('4', { message: 'category_id must be a valid UUID' })
  is_active: string;
}

export class GetServiceReviewDto extends IntersectionType(
  GetServiceReviewBaseDto,
  PaginationQueryDto,
) {}
