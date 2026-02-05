import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  IsOptional,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';

export class CreateServiceWorkFlowDto {
  @ApiProperty({
    description: 'Title of the service workflow',
    example: 'Requirement Analysis',
  })
  @IsString({ message: 'title must be a string.' })
  title: string;

  @ApiProperty({
    description: 'UUID of the service this workflow belongs to',
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
  })
  @IsUUID()
  @IsNotEmpty()
  service_id: string;

  @ApiProperty({
    description: 'Description of the service workflow (optional)',
    example: 'We analyze client requirements and define project scope.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'description must be a string.' })
  @MaxLength(500, {
    message: 'description can contain a maximum of 500 characters.',
  })
  description?: string;
}

export class ServiceWorkFlowResponseDto {
  @ApiProperty({
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
    description: 'Unique identifier for the service workflow record',
  })
  id: string;

  @ApiProperty({
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
    description: 'Unique identifier for the service this workflow belongs to',
  })
  service_id: string;

  @ApiProperty({
    example: 'Requirement Analysis',
    description: 'Title of the service workflow',
  })
  title: string;

  @ApiProperty({
    example: 'We analyze client requirements and define project scope.',
    description: 'Description of the service workflow',
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
