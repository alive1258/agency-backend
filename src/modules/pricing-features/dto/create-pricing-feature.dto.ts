import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreatePricingFeatureDto {
  @ApiProperty({
    description: 'Title of the pricing feature',
    example: 'Unlimited Projects',
    maxLength: 150,
  })
  @IsString({ message: 'Title must be a string.' })
  @MaxLength(150, {
    message: 'Title can contain a maximum of 150 characters.',
  })
  title: string;
}

export class PricingFeatureResponseDto {
  @ApiProperty({
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
    description: 'Unique identifier for the pricing feature',
  })
  id: string;

  @ApiProperty({
    example: 'Unlimited Projects',
    description: 'Title of the pricing feature',
  })
  title: string;

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
