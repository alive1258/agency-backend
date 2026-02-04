import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetSubscriptionBaseDto {

    /**
     * Filter by service ID
     */
    @ApiPropertyOptional({
        description: 'Filter by service ID',
        example: '8a3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a1',
    })
    @IsOptional()
    @IsUUID('4', { message: 'service_id must be a valid UUID' })
    service_id?: string;

    /**
     * Filter by pricing ID
     */
    @ApiPropertyOptional({
        description: 'Filter by pricing ID',
        example: '9b3f0f7b-6d59-4db4-bdc1-2b45a9c9c5a2',
    })
    @IsOptional()
    @IsUUID('4', { message: 'pricing_id must be a valid UUID' })
    pricing_id?: string;

    /**
     * Filter by the user who added it
     */
    @ApiPropertyOptional({
        description: 'Filter by added_by user ID',
        example: '123456789',
    })
    @IsOptional()
    @IsString({ message: 'added_by must be a string (bigint)' })
    added_by?: string;

    /**
     * Filter by status
     */
    @ApiPropertyOptional({
        description: 'Filter by active status',
        example: true,
    })
    @IsOptional()
    @IsBoolean({ message: 'status must be a boolean value' })
    status?: boolean;
}

/**
 * Get Subscription DTO with Pagination
 */
export class GetSubscriptionDto extends IntersectionType(
    GetSubscriptionBaseDto,
    PaginationQueryDto,
) { }