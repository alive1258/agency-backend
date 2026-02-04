import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OurWorkProcessService } from './our-work-process.service';
import { CreateOurWorkProcessDto } from './dto/create-our-work-process.dto';
import { UpdateOurWorkProcessDto } from './dto/update-our-work-process.dto';

@Controller('our-work-process')
export class OurWorkProcessController {
  constructor(private readonly ourWorkProcessService: OurWorkProcessService) {}

  @Post()
  create(@Body() createOurWorkProcessDto: CreateOurWorkProcessDto) {
    return this.ourWorkProcessService.create(createOurWorkProcessDto);
  }

  @Get()
  findAll() {
    return this.ourWorkProcessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ourWorkProcessService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOurWorkProcessDto: UpdateOurWorkProcessDto) {
    return this.ourWorkProcessService.update(+id, updateOurWorkProcessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ourWorkProcessService.remove(+id);
  }
}
