import { PartialType } from '@nestjs/swagger';
import { CreateServiceVideoDto } from './create-service-video.dto';

export class UpdateServiceVideoDto extends PartialType(CreateServiceVideoDto) {}
