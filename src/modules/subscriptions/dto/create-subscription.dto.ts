import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";

export class CreateSubscriptionDto {

    /**
     * service ID
     */
    @IsUUID()
    @IsNotEmpty()
    service_id: string;

    /**
     * Pricing ID
     */
    @IsUUID()
    @IsNotEmpty()
    pricing_id: string;

    /**
     * price
     */
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsOptional()
    price?: number;

    /**
     * status
     */
    @IsBoolean()
    @IsOptional()
    status?: boolean;

    /**
     * Expired Date
     */
    @IsDateString()
    @IsOptional()
    expired_at?: Date;
}
