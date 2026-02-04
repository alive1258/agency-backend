import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID of the pricing id',
    example: '9b3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a2',
  })
  @IsUUID('4', { message: 'id must be a valid UUID' })
  pricing_id: string;
}
