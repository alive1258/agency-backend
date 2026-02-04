import { Module } from '@nestjs/common';
import { PortfolioDetailsService } from './portfolio-details.service';
import { PortfolioDetailsController } from './portfolio-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioDetail } from './entities/portfolio-detail.entity';
import { Portfolio } from '../portfolio/entities/portfolio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioDetail, Portfolio])],
  controllers: [PortfolioDetailsController],
  providers: [PortfolioDetailsService],
  exports: [PortfolioDetailsService],
})
export class PortfolioDetailsModule {}
