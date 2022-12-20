import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Client } from './models/client.model';
import {ClientsController} from "./clients.controller";
import { ClientsService } from "./clients.service";

@Module({
    imports: [SequelizeModule.forFeature([Client])],
    providers: [ClientsService],
    controllers: [ClientsController],
})
export class ClientsModule {}
