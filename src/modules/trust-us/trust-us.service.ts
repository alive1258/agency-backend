import { Injectable } from '@nestjs/common';
import { CreateTrustUsDto } from './dto/create-trust-us.dto';
import { UpdateTrustUsDto } from './dto/update-trust-us.dto';

@Injectable()
export class TrustUsService {
  create(createTrustUsDto: CreateTrustUsDto) {
    return 'This action adds a new trustUs';
  }

  findAll() {
    return `This action returns all trustUs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trustUs`;
  }

  update(id: number, updateTrustUsDto: UpdateTrustUsDto) {
    return `This action updates a #${id} trustUs`;
  }

  remove(id: number) {
    return `This action removes a #${id} trustUs`;
  }
}
