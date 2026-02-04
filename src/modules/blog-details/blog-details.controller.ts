import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlogDetailsService } from './blog-details.service';
import { CreateBlogDetailDto } from './dto/create-blog-detail.dto';
import { UpdateBlogDetailDto } from './dto/update-blog-detail.dto';

@Controller('blog-details')
export class BlogDetailsController {
  constructor(private readonly blogDetailsService: BlogDetailsService) {}

  @Post()
  create(@Body() createBlogDetailDto: CreateBlogDetailDto) {
    return this.blogDetailsService.create(createBlogDetailDto);
  }

  @Get()
  findAll() {
    return this.blogDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDetailDto: UpdateBlogDetailDto) {
    return this.blogDetailsService.update(+id, updateBlogDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogDetailsService.remove(+id);
  }
}
