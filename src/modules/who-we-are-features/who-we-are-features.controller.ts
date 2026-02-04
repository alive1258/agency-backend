import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WhoWeAreFeaturesService } from './who-we-are-features.service';
import { CreateWhoWeAreFeatureDto } from './dto/create-who-we-are-feature.dto';
import { UpdateWhoWeAreFeatureDto } from './dto/update-who-we-are-feature.dto';

@Controller('who-we-are-features')
export class WhoWeAreFeaturesController {
  constructor(private readonly whoWeAreFeaturesService: WhoWeAreFeaturesService) {}

  @Post()
  create(@Body() createWhoWeAreFeatureDto: CreateWhoWeAreFeatureDto) {
    return this.whoWeAreFeaturesService.create(createWhoWeAreFeatureDto);
  }

  @Get()
  findAll() {
    return this.whoWeAreFeaturesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.whoWeAreFeaturesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWhoWeAreFeatureDto: UpdateWhoWeAreFeatureDto) {
    return this.whoWeAreFeaturesService.update(+id, updateWhoWeAreFeatureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.whoWeAreFeaturesService.remove(+id);
  }
}
