import { Injectable } from '@nestjs/common';
import { CreateWhoWeAreDto } from './dto/create-who-we-are.dto';
import { UpdateWhoWeAreDto } from './dto/update-who-we-are.dto';

@Injectable()
export class WhoWeAreService {
  create(createWhoWeAreDto: CreateWhoWeAreDto) {
    return 'This action adds a new whoWeAre';
  }

  findAll() {
    return `This action returns all whoWeAre`;
  }

  findOne(id: number) {
    return `This action returns a #${id} whoWeAre`;
  }

  update(id: number, updateWhoWeAreDto: UpdateWhoWeAreDto) {
    return `This action updates a #${id} whoWeAre`;
  }

  remove(id: number) {
    return `This action removes a #${id} whoWeAre`;
  }
}
