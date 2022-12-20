import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Service } from './models/service.model';
import { ServicesController } from "./services.controller";
import { ServicesService } from "./services.service";

@Module({
    imports: [SequelizeModule.forFeature([Service])],
    providers: [ServicesService],
    controllers: [ServicesController],
})
export class ServicesModule {}
