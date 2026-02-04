import { Module } from '@nestjs/common';
import { HerosService } from './heros.service';
import { HerosController } from './heros.controller';
import { Hero } from './entities/hero.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports: [TypeOrmModule.forFeature([Hero])],
  controllers: [HerosController],
  providers: [HerosService],
  exports: [HerosService],
})
export class HerosModule {}
