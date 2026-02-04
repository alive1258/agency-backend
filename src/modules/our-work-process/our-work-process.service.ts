import { Injectable } from '@nestjs/common';
import { CreateOurWorkProcessDto } from './dto/create-our-work-process.dto';
import { UpdateOurWorkProcessDto } from './dto/update-our-work-process.dto';

@Injectable()
export class OurWorkProcessService {
  create(createOurWorkProcessDto: CreateOurWorkProcessDto) {
    return 'This action adds a new ourWorkProcess';
  }

  findAll() {
    return `This action returns all ourWorkProcess`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ourWorkProcess`;
  }

  update(id: number, updateOurWorkProcessDto: UpdateOurWorkProcessDto) {
    return `This action updates a #${id} ourWorkProcess`;
  }

  remove(id: number) {
    return `This action removes a #${id} ourWorkProcess`;
  }
}
