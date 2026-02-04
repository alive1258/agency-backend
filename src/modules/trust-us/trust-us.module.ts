import { Module } from '@nestjs/common';
import { TrustUsService } from './trust-us.service';
import { TrustUsController } from './trust-us.controller';
import { TrustUs } from './entities/trust-us.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([TrustUs])],
  controllers: [TrustUsController],
  providers: [TrustUsService],
  exports: [TrustUsService],
})
export class TrustUsModule {}
