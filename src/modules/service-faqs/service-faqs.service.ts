import { Injectable } from '@nestjs/common';
import { CreateServiceFaqDto } from './dto/create-service-faq.dto';
import { UpdateServiceFaqDto } from './dto/update-service-faq.dto';

@Injectable()
export class ServiceFaqsService {
  create(createServiceFaqDto: CreateServiceFaqDto) {
    return 'This action adds a new serviceFaq';
  }

  findAll() {
    return `This action returns all serviceFaqs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceFaq`;
  }

  update(id: number, updateServiceFaqDto: UpdateServiceFaqDto) {
    return `This action updates a #${id} serviceFaq`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceFaq`;
  }
}
