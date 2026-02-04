import { Module } from "@nestjs/common";
import { UpzelasController } from "./upzelas.controller";
import { UpzelaService } from "./upzelas.service";
import { UpzelaEntity } from "./entities/upzelas.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DistrictEntity } from "../districts/entities/districts.entity";

@Module({
  controllers: [UpzelasController],
  providers: [UpzelaService],
  imports: [TypeOrmModule.forFeature([UpzelaEntity,DistrictEntity])],
  exports: [UpzelaService],
})
export class UpzelasModule {}