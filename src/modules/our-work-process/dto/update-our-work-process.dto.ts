import { PartialType } from '@nestjs/swagger';
import { CreateOurWorkProcessDto } from './create-our-work-process.dto';

export class UpdateOurWorkProcessDto extends PartialType(CreateOurWorkProcessDto) {}
