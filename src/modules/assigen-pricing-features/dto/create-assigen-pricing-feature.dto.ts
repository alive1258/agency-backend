


import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAssigenPricingFeatureDto {
  /** Pricing UUID */
  @ApiProperty({
    description: 'UUID of the pricing',
    example: '1f2c3d4e-5a6b-7c8d-9e10-abcdef123456',
  })
  @IsUUID()
  @IsNotEmpty()
  pricing_id: string;

  /** Pricing Feature UUID */
  @ApiProperty({
    description: 'UUID of the pricing feature',
    example: '9e8d7c6b-5a4f-3e2d-1c0b-fedcba654321',
  })
  @IsUUID()
  @IsNotEmpty()
  pricing_features_id: string;
}


export class AssignPricingFeatureResponseDto {
  @ApiProperty({
    description: 'Assign pricing feature UUID',
    example: '3c9b9c2e-7a1b-4f0a-9c55-1c2e3a4b5d6f',
  })
  id: string;

  @ApiProperty({
    description: 'Pricing UUID',
    example: '1f2c3d4e-5a6b-7c8d-9e10-abcdef123456',
  })
  pricing_id: string;

  @ApiProperty({
    description: 'Pricing feature UUID',
    example: '9e8d7c6b-5a4f-3e2d-1c0b-fedcba654321',
  })
  pricing_features_id: string;


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

