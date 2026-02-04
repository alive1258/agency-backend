import { Module } from '@nestjs/common';
import { PortfolioCategoriesService } from './portfolio-categories.service';
import { PortfolioCategoriesController } from './portfolio-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioCategory } from './entities/portfolio-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioCategory])],
  controllers: [PortfolioCategoriesController],
  providers: [PortfolioCategoriesService],
  exports: [PortfolioCategoriesService],
})
export class PortfolioCategoriesModule {}
