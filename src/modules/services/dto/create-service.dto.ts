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

export class CreateServiceDto {
  /** Service name */
  @ApiProperty({
    description: 'Name of the service',
    example: 'Web Development',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  /** Category UUID */
  @ApiProperty({
    description: 'UUID of the related category',
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
  })
  @IsUUID()
  category_id: string;

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

  /** Number of companies using this service */
  @ApiProperty({
    description: 'Number of companies using this service',
    example: 120,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  used_by_companies?: number;

  /** Landing page URL */
  @ApiProperty({
    description: 'Landing page URL',
    example: 'https://example.com/service',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  landing_page?: string;

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

  /** District availability */
  @ApiProperty({
    description: 'Available districts',
    example: 'Dhaka, Chittagong',
    required: false,
  })
  @IsString()
  @IsOptional()
  districts?: string;

  /** Image URL */
  @ApiProperty({
    description: 'Service image URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  image?: string;

  /** Video URL */
  @ApiProperty({
    description: 'Promotional video URL',
    example: 'https://youtube.com/watch?v=xxxxx',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  video_url?: string;
}

export class ServiceResponseDto {
  @ApiProperty({ description: 'Service UUID' })
  id: string;

  @ApiProperty({ description: 'Service name' })
  name: string;

  @ApiProperty({ description: 'Category UUID' })
  category_id: string;

  @ApiProperty({ description: 'Service description' })
  description: string;

  @ApiProperty({ description: 'Key features', required: false })
  key_features?: string;

  @ApiProperty({ description: 'Companies using this service', required: false })
  used_by_companies?: number;

  @ApiProperty({ description: 'Landing page', required: false })
  landing_page?: string;

  @ApiProperty({ description: 'Service rating', required: false })
  rating?: number;

  @ApiProperty({ description: 'District availability', required: false })
  districts?: string;

  @ApiProperty({ description: 'Image URL', required: false })
  image?: string;

  @ApiProperty({ description: 'Video URL', required: false })
  video_url?: string;

  @ApiProperty({ description: 'Category summary', type: Object })
  category?: {
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
