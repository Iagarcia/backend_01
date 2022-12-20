import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Schedule } from './models/schedule.model';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';

import { Service } from "../services/models/service.model"
import { Provider } from "../providers/models/provider.model";
import { Contract } from 'src/contracts/models/contract.model';
import { Client } from 'src/clients/models/client.model';

@Module({
    imports: [SequelizeModule.forFeature([
        Schedule,
        Service,
        Provider,
        Contract,
        Client
    ])],
    providers: [SchedulesService],
    controllers: [SchedulesController],
})
export class SchedulesModule {}