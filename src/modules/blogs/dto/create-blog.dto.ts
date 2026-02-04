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

export class CreateBlogDto {
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
  blog_category_id: string;

  /** Description */
  @ApiProperty({
    description: 'Detailed service description',
    example: 'Professional web development services',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  /** Key features (comma separated or JSON) */
  @ApiProperty({
    description: 'Key features of the service',
    example: 'Fast, Secure, Scalable',
    required: false,
  })
  @IsString()
  @IsOptional()
  key_features?: string;

  /** Rating (0–5) */
  @ApiProperty({
    description: 'Service rating',
    example: 4.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  rating?: number;

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

export class ServiceResponseDto {
  @ApiProperty({ description: 'Service UUID' })
  id: string;

  @ApiProperty({ description: 'Service name' })
  name: string;

  @ApiProperty({ description: 'Category UUID' })
  blog_category_id: string;

  @ApiProperty({ description: 'Service description' })
  description: string;

  @ApiProperty({ description: 'Key features', required: false })
  key_features?: string;

  @ApiProperty({ description: 'Service rating', required: false })
  rating?: number;

  @ApiProperty({ description: 'Image URL', required: false })
  image?: string;

  @ApiProperty({ description: 'Category summary', type: Object })
  blog_categories?: {
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
