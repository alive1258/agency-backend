import { Injectable } from '@nestjs/common';
import { CreateServiceWorkGalleryDto } from './dto/create-service-work-gallery.dto';
import { UpdateServiceWorkGalleryDto } from './dto/update-service-work-gallery.dto';

@Injectable()
export class ServiceWorkGalleriesService {
  create(createServiceWorkGalleryDto: CreateServiceWorkGalleryDto) {
    return 'This action adds a new serviceWorkGallery';
  }

  findAll() {
    return `This action returns all serviceWorkGalleries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceWorkGallery`;
  }

  update(id: number, updateServiceWorkGalleryDto: UpdateServiceWorkGalleryDto) {
    return `This action updates a #${id} serviceWorkGallery`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceWorkGallery`;
  }
}
