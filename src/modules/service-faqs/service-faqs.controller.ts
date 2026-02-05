import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceFaqsService } from './service-faqs.service';
import { CreateServiceFaqDto } from './dto/create-service-faq.dto';
import { UpdateServiceFaqDto } from './dto/update-service-faq.dto';

@Controller('service-faqs')
export class ServiceFaqsController {
  constructor(private readonly serviceFaqsService: ServiceFaqsService) {}

  @Post()
  create(@Body() createServiceFaqDto: CreateServiceFaqDto) {
    return this.serviceFaqsService.create(createServiceFaqDto);
  }

  @Get()
  findAll() {
    return this.serviceFaqsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceFaqsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceFaqDto: UpdateServiceFaqDto) {
    return this.serviceFaqsService.update(+id, updateServiceFaqDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceFaqsService.remove(+id);
  }
}
