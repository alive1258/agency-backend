import { PartialType } from '@nestjs/swagger';
import { CreateServiceWorkGalleryDto } from './create-service-work-gallery.dto';

export class UpdateServiceWorkGalleryDto extends PartialType(CreateServiceWorkGalleryDto) {}
