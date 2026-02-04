import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { BlogCategory } from '../blog-categories/entities/blog-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, BlogCategory])],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
