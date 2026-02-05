import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceWorkFlowsService } from './service-work-flows.service';
import { CreateServiceWorkFlowDto } from './dto/create-service-work-flow.dto';
import { UpdateServiceWorkFlowDto } from './dto/update-service-work-flow.dto';

@Controller('service-work-flows')
export class ServiceWorkFlowsController {
  constructor(private readonly serviceWorkFlowsService: ServiceWorkFlowsService) {}

  @Post()
  create(@Body() createServiceWorkFlowDto: CreateServiceWorkFlowDto) {
    return this.serviceWorkFlowsService.create(createServiceWorkFlowDto);
  }

  @Get()
  findAll() {
    return this.serviceWorkFlowsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceWorkFlowsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceWorkFlowDto: UpdateServiceWorkFlowDto) {
    return this.serviceWorkFlowsService.update(+id, updateServiceWorkFlowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceWorkFlowsService.remove(+id);
  }
}
