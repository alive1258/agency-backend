import { Injectable } from '@nestjs/common';
import { CreateBlogDetailDto } from './dto/create-blog-detail.dto';
import { UpdateBlogDetailDto } from './dto/update-blog-detail.dto';

@Injectable()
export class BlogDetailsService {
  create(createBlogDetailDto: CreateBlogDetailDto) {
    return 'This action adds a new blogDetail';
  }

  findAll() {
    return `This action returns all blogDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blogDetail`;
  }

  update(id: number, updateBlogDetailDto: UpdateBlogDetailDto) {
    return `This action updates a #${id} blogDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} blogDetail`;
  }
}
