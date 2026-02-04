import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateServiceReviewDto {
  @ApiProperty({
    description: 'UUID of the related service',
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
  })
  @IsUUID()
  @IsNotEmpty()
  service_id: string;

  @ApiProperty({
    description: 'UUID of the related service video',
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
  })
  @IsUUID()
  @IsNotEmpty()
  service_video_id: string;

  @ApiProperty({
    description: 'Rating value between 1 and 5',
    example: 5,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Detailed review message',
    example: 'Excellent service and very informative video.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class ServiceReviewResponseDto {
  @ApiProperty({ description: 'Review UUID' })
  id: string;

  @ApiProperty({ description: 'Service UUID' })
  service_id: string;

  @ApiProperty({ description: 'Video UUID' })
  service_video_id: string;

  @ApiProperty({ description: 'Rating value (1-5)' })
  rating: number;

  @ApiProperty({ description: 'Review message' })
  message: string;

  @ApiProperty({ description: 'Is active', required: false })
  is_active?: boolean;

  @ApiProperty({
    description: 'Service summary',
    type: Object,
    required: false,
  })
  service?: {
    id: string;
    name: string;
  };

  @ApiProperty({
    description: 'Video summary',
    type: Object,
    required: false,
  })
  video?: {
    id: string;
    title: string;
  };

  @ApiProperty({
    description: 'Added by summary',
    type: Object,
    required: false,
  })
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
    required: false,
    example: '2025-01-01T00:00:00.000Z',
  })
  deleted_at?: Date;
}
