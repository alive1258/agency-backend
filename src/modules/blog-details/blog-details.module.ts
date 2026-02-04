import { Module } from '@nestjs/common';
import { BlogDetailsService } from './blog-details.service';
import { BlogDetailsController } from './blog-details.controller';

@Module({
  controllers: [BlogDetailsController],
  providers: [BlogDetailsService],
})
export class BlogDetailsModule {}
