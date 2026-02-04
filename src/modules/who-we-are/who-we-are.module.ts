import { Module } from '@nestjs/common';
import { WhoWeAreService } from './who-we-are.service';
import { WhoWeAreController } from './who-we-are.controller';

@Module({
  controllers: [WhoWeAreController],
  providers: [WhoWeAreService],
})
export class WhoWeAreModule {}
