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

export class CreatePortfolioDto {
  /** Service name */
  @ApiProperty({
    description: 'Name of the service',
    example: 'Web Development',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  /** Category UUID */
  @ApiProperty({
    description: 'UUID of the related category',
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
  })
  @IsUUID()
  portfolio_category_id: string;

  /** Description */
  @ApiProperty({
    description: 'Detailed portfolio description',
    example: 'Professional web development portfolio',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  /** Key company_name (comma separated or JSON) */
  @ApiProperty({
    description: 'Key company name of the portfolio',
    example: 'Tech Solutions Inc.',
    required: false,
  })
  @IsString()
  @IsOptional()
  company_name?: string;

  /** Image URL */
  @ApiProperty({
    description: 'Service image URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  image?: string;
}

export class PortfolioResponseDto {
  @ApiProperty({ description: 'Portfolio UUID' })
  id: string;

  @ApiProperty({ description: 'Portfolio name' })
  title: string;

  @ApiProperty({ description: 'Category UUID' })
  portfolio_category_id: string;

  @ApiProperty({ description: 'Portfolio description' })
  description: string;

  @ApiProperty({ description: 'Key company name', required: false })
  company_name?: string;

  @ApiProperty({ description: 'Image URL', required: false })
  image?: string;

  @ApiProperty({ description: 'Category summary', type: Object })
  portfolio_categories?: {
    id: string;
    name: string;
  };

  @ApiProperty({ description: 'Added by summary', type: Object })
  addedBy?: {
    id: string;
    name?: string;
    email?: string; // <- make optional
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
