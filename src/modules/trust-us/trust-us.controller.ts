import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrustUsService } from './trust-us.service';
import { CreateTrustUsDto } from './dto/create-trust-us.dto';
import { UpdateTrustUsDto } from './dto/update-trust-us.dto';

@Controller('trust-us')
export class TrustUsController {
  constructor(private readonly trustUsService: TrustUsService) {}

  @Post()
  create(@Body() createTrustUsDto: CreateTrustUsDto) {
    return this.trustUsService.create(createTrustUsDto);
  }

  @Get()
  findAll() {
    return this.trustUsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trustUsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrustUsDto: UpdateTrustUsDto) {
    return this.trustUsService.update(+id, updateTrustUsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trustUsService.remove(+id);
  }
}
