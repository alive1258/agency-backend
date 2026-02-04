import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreatePartnerDto {
  /** Partner name */
  @ApiProperty({
    description: 'Name of the partner',
    example: 'Tech Partner Ltd.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  /** Partner image URL */
  @ApiProperty({
    description: 'Partner logo/image URL',
    example: 'https://example.com/partner.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  image?: string;
}

export class PartnerResponseDto {
  @ApiProperty({ description: 'Partner UUID' })
  id: string;

  @ApiProperty({ description: 'Partner name' })
  name: string;

  @ApiProperty({
    description: 'Partner logo/image URL',
    required: false,
  })
  image?: string;

  @ApiProperty({ description: 'User who added this partner', type: Object, required: false })
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
    description: 'Soft delete timestamp, if deleted',
    example: '2025-01-01T00:00:00.000Z',
    required: false,
  })
  deleted_at?: Date;
}
