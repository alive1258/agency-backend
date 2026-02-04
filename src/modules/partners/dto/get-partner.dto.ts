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

class GetPartnerBaseDto {
   @ApiPropertyOptional({
    description: 'Filter by Partner title (partial match)',
    example: 'Digital Solutions',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class GetPartnerDto extends IntersectionType(
  GetPartnerBaseDto,
  PaginationQueryDto,
) {}
