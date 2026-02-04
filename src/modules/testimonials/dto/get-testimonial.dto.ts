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

class GetTestimonialBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by client name (partial match)',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by client designation (partial match)',
    example: 'CEO',
  })
  @IsOptional()
  @IsString()
  designation?: string;



  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class GetTestimonialDto extends IntersectionType(
  GetTestimonialBaseDto,
  PaginationQueryDto,
) {}
