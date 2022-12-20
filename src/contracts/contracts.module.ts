import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Contract } from './models/contract.model';
import { ContractsController } from "./contracts.controller";
import { ContractsService } from "./contracts.service";

@Module({
    imports: [SequelizeModule.forFeature([Contract])],
    providers: [ContractsService],
    controllers: [ContractsController],
})
export class ContractsModule {}
