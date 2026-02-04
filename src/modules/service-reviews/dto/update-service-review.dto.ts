import { PartialType } from '@nestjs/swagger';
import { CreateServiceReviewDto } from './create-service-review.dto';

export class UpdateServiceReviewDto extends PartialType(CreateServiceReviewDto) {}
