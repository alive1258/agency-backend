import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceWorkGalleriesService } from './service-work-galleries.service';
import { CreateServiceWorkGalleryDto } from './dto/create-service-work-gallery.dto';
import { UpdateServiceWorkGalleryDto } from './dto/update-service-work-gallery.dto';

@Controller('service-work-galleries')
export class ServiceWorkGalleriesController {
  constructor(private readonly serviceWorkGalleriesService: ServiceWorkGalleriesService) {}

  @Post()
  create(@Body() createServiceWorkGalleryDto: CreateServiceWorkGalleryDto) {
    return this.serviceWorkGalleriesService.create(createServiceWorkGalleryDto);
  }

  @Get()
  findAll() {
    return this.serviceWorkGalleriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceWorkGalleriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceWorkGalleryDto: UpdateServiceWorkGalleryDto) {
    return this.serviceWorkGalleriesService.update(+id, updateServiceWorkGalleryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceWorkGalleriesService.remove(+id);
  }
}
