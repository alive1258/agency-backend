import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateOurWorkProcessDto {
  /** Our work process title */
  @ApiProperty({
    description: 'title of the our work process',
    example: 'Web Development',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  /** Description */
  @ApiProperty({
    description: 'Detailed service description',
    example: 'Professional web development services',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  /** color_code availability */
  @ApiProperty({
    description: 'Available color_code for the service',
    example: '#fff000',
    required: false,
  })
  @IsString()
  @IsOptional()
  color_code?: string;

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

export class OurWorkProcessResponseDto {
  @ApiProperty({ description: 'Our work process UUID' })
  id: string;

  @ApiProperty({ description: 'Our work process title' })
  title: string;

  @ApiProperty({ description: 'Service description' })
  description: string;

  @ApiProperty({ description: 'color_code availability', required: false })
  color_code?: string;

  @ApiProperty({ description: 'Image URL', required: false })
  image?: string;

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
