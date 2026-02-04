import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  IsOptional,
  IsUrl,
  Min,
  Max,
} from 'class-validator';

export class CreatePortfolioDetailDto {
  @ApiProperty({
    description: 'Name of the service',
    example: 'Web Development',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'UUID of the related category',
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
  })
  @IsUUID()
  portfolio_id: string;

  @ApiProperty({
    description: 'Detailed service description',
    example: 'Professional web development services',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Key features of the service',
    example: 'Fast, Secure, Scalable',
    required: false,
  })
  @IsString()
  @IsOptional()
  key_features?: string;

  @ApiProperty({
    description: 'Service image URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  image?: string;
}

export class PortfolioDetailResponseDto {
  @ApiProperty({ description: 'Portfolio Detail UUID' })
  id: string;

  @ApiProperty({ description: 'Portfolio Detail title' })
  title: string;

  @ApiProperty({ description: 'Category UUID' })
  portfolio_id: string;

  @ApiProperty({ description: 'Blog Detail description' })
  description: string;

  @ApiProperty({ description: 'Key features', required: false })
  key_features?: string;

  @ApiProperty({ description: 'Image URL', required: false })
  image?: string;

  @ApiProperty({ description: 'Portfolio summary', type: Object })
  portfolio?: {
    id: string;
    name: string;
  };

  @ApiProperty({ description: 'Added by summary', type: Object })
  addedBy?: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  };

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: Date;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    required: false,
  })
  deleted_at?: Date;
}
