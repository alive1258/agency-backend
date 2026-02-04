import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export class CreatePricingDto {
  @ApiProperty({
    description: 'ID of the associated service',
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
  })
  @IsUUID('4', { message: 'service_id must be a valid UUID' })
  service_id: string;

  @ApiProperty({
    description: 'ID of the pricing category',
    example: '9b3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a2',
  })
  @IsUUID('4', { message: 'pricing_category_id must be a valid UUID' })
  pricing_category_id: string;


  @ApiProperty({
    description: 'Price for this combination',
    example: 99.99,
  })
  @IsNumber({}, { message: 'price must be a number' })
  @Min(0, { message: 'price must be at least 0' })
  price: number;

  @ApiPropertyOptional({
    description: 'Discount for this pricing (optional)',
    example: 10,
  })
  @IsOptional()
  @IsNumber({}, { message: 'discount must be a number' })
  @Min(0, { message: 'discount must be at least 0' })
  discount?: number;

  @ApiProperty({
    description: 'Billing cycle for this pricing',
    enum: BillingCycle,
    example: BillingCycle.MONTHLY,
  })
  @IsEnum(BillingCycle, { message: 'billing_cycle must be monthly or yearly' })
  billing_cycle: BillingCycle;
}



export class PricingResponseDto {
  @ApiProperty({ example: '8a3f0f7b-6d59-4db4-bdc1-2b45c9c5a4', description: 'Unique identifier for the pricing record' })
  id: string;

  @ApiProperty({ example: '8a3f0f7b-6d59-4db4-bdc1-2b45c9c5a1', description: 'ID of the associated service' })
  service_id: string;

  @ApiProperty({ example: '9b3f0f7b-6d59-4db4-bdc1-2b45c9c5a2', description: 'ID of the pricing category' })
  pricing_category_id: string;



  @ApiProperty({ example: 99.99, description: 'Price for this combination' })
  price: number;

  @ApiPropertyOptional({ example: 10, description: 'Discount for this pricing (optional)' })
  discount?: number;

  @ApiProperty({ example: BillingCycle.MONTHLY, description: 'Billing cycle for this pricing', enum: BillingCycle })
  billing_cycle: BillingCycle;

  @ApiProperty({ example: true, description: 'Indicates whether the record is active' })
  is_active: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Timestamp when the record was created' })
  created_at: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Timestamp when the record was last updated' })
  updated_at: Date;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z', description: 'Timestamp when the record was soft deleted (optional)' })
  deleted_at?: Date;

  // --- Minimal Nested Fields ---
  @ApiPropertyOptional({
    description: 'Minimal info of the user who added this record',
    type: Object,
    example: { id: 'user-uuid', name: 'John Doe', role: 'admin' },
  })
  addedBy?: {
    id: string;
    name?: string;
    role: string;
  };

  @ApiPropertyOptional({
    description: 'Minimal info of the associated service',
    type: Object,
    example: { id: 'service-uuid', name: 'Web Development' },
  })
  service?: {
    id: string;
    name: string;
  };

  @ApiPropertyOptional({
    description: 'Minimal info of the pricing category',
    type: Object,
    example: { id: 'category-uuid', title: 'Enterprise Plan' },
  })
  pricingCategory?: {
    id: string;
    title: string;
  };

;
}

