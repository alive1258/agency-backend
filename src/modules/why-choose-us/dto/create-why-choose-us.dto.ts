import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateWhyChooseUsDto {
  @ApiProperty({
    description: 'UUID of the service this workflow belongs to',
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
  })
  @IsUUID()
  @IsNotEmpty()
  service_id: string;

  @ApiProperty({
    description: 'Headline text for Why Choose Us section.',
    example: 'Trusted by Thousands of Clients',
    maxLength: 150,
  })
  @IsString({ message: 'Headline must be a string.' })
  @MaxLength(150, {
    message: 'Headline can contain a maximum of 150 characters.',
  })
  headline: string;
  @ApiProperty({
    description: 'Headline text for Why Choose Us section.',
    example: 'Trusted by Thousands of Clients',
    maxLength: 150,
  })
  @IsString({ message: 'Headline must be a string.' })
  @MaxLength(150, {
    message: 'Headline can contain a maximum of 150 characters.',
  })
  description: string;
}

export class WhyChooseUsResponseDto {
  @ApiProperty({
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
    description: 'Unique identifier for the Why Choose Us record',
  })
  id: string;
  @ApiProperty({
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
    description: 'Unique identifier for the Why Choose Us record',
  })
  service_id: string;

  @ApiProperty({
    example: 'Trusted by Thousands of Clients',
    description: 'Headline text',
  })
  headline: string;
  @ApiProperty({
    example: 'Trusted by Thousands of Clients',
    description: 'Headline text',
  })
  description: string;

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
