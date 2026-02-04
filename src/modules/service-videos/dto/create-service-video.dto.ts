import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateServiceVideoDto {
  /** Service UUID */
  @ApiProperty({
    description: 'UUID of the related service',
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
  })
  @IsUUID()
  @IsNotEmpty()
  service_id: string;


  /** Title */
  @ApiProperty({
    description: 'Title of the ad platform',
    example: 'Facebook Ads Manager',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  /** Description */
  @ApiProperty({
    description: 'Detailed description of the ad platform',
    example: 'Comprehensive advertising platform for Facebook campaigns',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  /** Thumbnail URL */
  @ApiProperty({
    description: 'Thumbnail image URL',
    example: 'https://example.com/thumbnail.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  thumbnail?: string;

  /** ServiceVideo URL */
  @ApiProperty({
    description: 'Promotional ServiceVideo URL',
    example: 'https://youtube.com/watch?v=yyyyy',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  video_url?: string;
}

export class ServiceVideoResponseDto {
  @ApiProperty({ description: 'Ad Platform UUID' })
  id: string;

  @ApiProperty({ description: 'Service UUID' })
  service_id: string;


  @ApiProperty({ description: 'Title' })
  title: string;

  @ApiProperty({ description: 'Description' })
  description: string;

  @ApiProperty({ description: 'Thumbnail URL', required: false })
  thumbnail?: string;

  @ApiProperty({ description: 'Video URL', required: false })
  video_url?: string;

  @ApiProperty({ description: 'Is active', required: false })
  is_active?: boolean;

  @ApiProperty({ description: 'Service summary', type: Object })
  service?: {
    id: string;
    name: string;
  };

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
    description: 'Deletion timestamp',
    example: '2025-01-01T00:00:00.000Z',
    required: false,
  })
  deleted_at?: Date;
}
