import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional } from 'class-validator';

export class CreatePricingCategoryDto {
  @ApiProperty({
    description: 'Title of the pricing category',
    example: 'Enterprise Plan',
    maxLength: 150,
  })
  @IsString({ message: 'Title must be a string.' })
  @MaxLength(150, { message: 'Title can contain a maximum of 150 characters.' })
  title: string;

  @ApiProperty({
    description: 'Description of the pricing category (optional)',
    example: 'Best suited for large organizations with custom needs.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  @MaxLength(500, {
    message: 'Description can contain a maximum of 500 characters.',
  })
  description?: string;
}

export class PricingCategoryResponseDto {
  @ApiProperty({
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
    description: 'Unique identifier for the pricing category',
  })
  id: string;

  @ApiProperty({
    example: 'Enterprise Plan',
    description: 'Title of the pricing category',
  })
  title: string;

  @ApiProperty({
    example: 'Best suited for large organizations with custom needs.',
    description: 'Description of the pricing category',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the record is active',
  })
  is_active: boolean;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Timestamp when the record was created',
  })
  created_at: Date;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Timestamp when the record was last updated',
  })
  updated_at: Date;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Timestamp when the record was soft deleted (optional)',
    required: false,
  })
  deleted_at?: Date;
}
