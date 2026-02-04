import { Module } from '@nestjs/common';
import { BlogDetailsService } from './blog-details.service';
import { BlogDetailsController } from './blog-details.controller';
import { Blog } from '../blogs/entities/blog.entity';
import { BlogDetail } from './entities/blog-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BlogDetail, Blog])],
  controllers: [BlogDetailsController],
  providers: [BlogDetailsService],
  exports: [BlogDetailsService],
})
export class BlogDetailsModule {}
