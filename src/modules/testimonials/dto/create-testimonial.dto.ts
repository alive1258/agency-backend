import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export class CreateTestimonialDto {
  /** Client name */
  @ApiProperty({
    description: 'Name of the person giving the testimonial',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  /** Client designation */
  @ApiProperty({
    description: 'Job title or designation of the client',
    example: 'CEO, Tech Corp',
  })
  @IsString()
  @IsNotEmpty()
  designation: string;

  /** Client image */
  @ApiProperty({
    description: 'Client profile image URL',
    example: 'https://example.com/client.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  image?: string;

  /** Testimonial description */
  @ApiProperty({
    description: 'Testimonial message from the client',
    example: 'This company helped us scale our business tremendously.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  /** Rating (0–5) */
  @ApiProperty({
    description: 'Client rating',
    example: 5,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  /** Related Service UUID */
  @ApiProperty({
    description: 'Related service ID',
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
  })
  @IsUUID()
  service_id: string;

  /** Number of reviews generated */
  @ApiProperty({
    description: 'Number of reviews generated',
    example: 120,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  reviewGenerated?: number;

  /** Performance score */
  @ApiProperty({
    description: 'Performance score related to this testimonial',
    example: 95,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  performance?: number;
}


export class TestimonialResponseDto {
  @ApiProperty({ description: 'Testimonial UUID' })
  id: string;

  @ApiProperty({ description: 'Client name' })
  name: string;

  @ApiProperty({ description: 'Client designation' })
  designation: string;

  @ApiProperty({ description: 'Client image URL', required: false })
  image?: string;

  @ApiProperty({ description: 'Testimonial description' })
  description: string;

  @ApiProperty({ description: 'Client rating (0–5)' })
  rating: number;

  @ApiProperty({ description: 'Related service UUID' })
  service_id: string;

  @ApiProperty({ description: 'Number of reviews generated', required: false })
  reviewGenerated?: number;

  @ApiProperty({ description: 'Performance score', required: false })
  performance?: number;

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
    description: 'Soft delete timestamp',
    required: false,
  })
  deleted_at?: Date;
}


