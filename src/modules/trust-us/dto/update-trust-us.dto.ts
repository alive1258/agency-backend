import { PartialType } from '@nestjs/swagger';
import { CreateTrustUsDto } from './create-trust-us.dto';

export class UpdateTrustUsDto extends PartialType(CreateTrustUsDto) {}
