import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Client } from './models/client.model';
import {ClientsController} from "./clients.controller";
import { ClientsService } from "./clients.service";

@Module({
    imports: [ConfigModule, SequelizeModule.forFeature([Client])],
    providers: [ClientsService],
    controllers: [ClientsController],
})
export class ClientsModule {}
