import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateBlogCategoryDto {
  @ApiProperty({
    description: 'Name of the category.',
    example: 'Technology',
    maxLength: 150,
  })
  @IsString({ message: 'Category name must be a string.' })
  @MaxLength(150, {
    message: 'Category name can contain a maximum of 150 characters.',
  })
  name: string;
}

export class BlogCategoryResponseDto {
  @ApiProperty({
    example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
  })
  id: string;

  @ApiProperty({ example: 'Technology' })
  name: string;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updated_at: Date;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    required: false,
  })
  deleted_at?: Date;
}
