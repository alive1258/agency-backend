import { Module } from '@nestjs/common';
import { ServiceWorkGalleriesService } from './service-work-galleries.service';
import { ServiceWorkGalleriesController } from './service-work-galleries.controller';

@Module({
  controllers: [ServiceWorkGalleriesController],
  providers: [ServiceWorkGalleriesService],
})
export class ServiceWorkGalleriesModule {}
