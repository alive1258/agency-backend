import { Module } from '@nestjs/common';
import { WhoWeAreFeaturesService } from './who-we-are-features.service';
import { WhoWeAreFeaturesController } from './who-we-are-features.controller';

@Module({
  controllers: [WhoWeAreFeaturesController],
  providers: [WhoWeAreFeaturesService],
})
export class WhoWeAreFeaturesModule {}
