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

export class CreateHeroDto {
  /** Hero title */
  @ApiProperty({
    description: 'Main hero title',
    example: 'Powerful Digital Solutions',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  /** Hero description */
  @ApiProperty({
    description: 'Short hero section description',
    example: 'We help businesses grow with modern technology',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  /** Company name */
  @ApiProperty({
    description: 'Company name displayed in hero section',
    example: 'Tech Corp',
  })
  @IsString()
  @IsNotEmpty()
  company: string;

  /** Score (numeric highlight stat) */
  @ApiProperty({
    description: 'Performance or trust score',
    example: 98,
  })
  @IsNumber()
  @Min(0)
  score: number;

  /** Rating (0–5) */
  @ApiProperty({
    description: 'Average customer rating',
    example: 4.8,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  /** Hero image URL */
  @ApiProperty({
    description: 'Hero section image URL',
    example: 'https://example.com/hero.jpg',
  })
  @IsUrl()
  @IsOptional()
  image?: string;

  /** Hero video URL */
  @ApiProperty({
    description: 'Hero section video URL',
    example: 'https://youtube.com/watch?v=xxxxx',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  /** Number of campaigns */
  @ApiProperty({
    description: 'Number of successful campaigns',
    example: 250,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  campaigns?: number;

  /** Revenue generated */
  @ApiProperty({
    description: 'Revenue generated (numeric value)',
    example: 500000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  revenue?: number;
}

export class HeroResponseDto {
  @ApiProperty({ description: 'Hero UUID' })
  id: string;

  @ApiProperty({ description: 'Hero title' })
  title: string;

  @ApiProperty({ description: 'Hero description' })
  description: string;

  @ApiProperty({ description: 'Company name' })
  company: string;

  @ApiProperty({ description: 'Performance score' })
  score: number;

  @ApiProperty({ description: 'Customer rating' })
  rating: number;

  @ApiProperty({ description: 'Hero image URL', required: false })
  image?: string;

  @ApiProperty({ description: 'Hero video URL', required: false })
  videoUrl?: string;

  @ApiProperty({ description: 'Number of campaigns', required: false })
  campaigns?: number;

  @ApiProperty({ description: 'Revenue generated', required: false })
  revenue?: number;

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


