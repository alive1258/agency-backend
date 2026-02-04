import { Module } from '@nestjs/common';
import { ServiceVideosService } from './service-videos.service';
import { ServiceVideosController } from './service-videos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../services/entities/service.entity';
import { ServiceVideo } from './entities/service-video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, ServiceVideo])],
  controllers: [ServiceVideosController],
  providers: [ServiceVideosService],
  exports: [ServiceVideosService],
})
export class ServiceVideosModule {}
