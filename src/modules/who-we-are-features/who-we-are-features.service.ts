import { Injectable } from '@nestjs/common';
import { CreateWhoWeAreFeatureDto } from './dto/create-who-we-are-feature.dto';
import { UpdateWhoWeAreFeatureDto } from './dto/update-who-we-are-feature.dto';

@Injectable()
export class WhoWeAreFeaturesService {
  create(createWhoWeAreFeatureDto: CreateWhoWeAreFeatureDto) {
    return 'This action adds a new whoWeAreFeature';
  }

  findAll() {
    return `This action returns all whoWeAreFeatures`;
  }

  findOne(id: number) {
    return `This action returns a #${id} whoWeAreFeature`;
  }

  update(id: number, updateWhoWeAreFeatureDto: UpdateWhoWeAreFeatureDto) {
    return `This action updates a #${id} whoWeAreFeature`;
  }

  remove(id: number) {
    return `This action removes a #${id} whoWeAreFeature`;
  }
}
