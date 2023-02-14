import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Request } from './models/request.model';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

@Module({
  imports: [ConfigModule, SequelizeModule.forFeature([Request])],
  controllers: [RequestsController],
  providers: [RequestsService]
})
export class RequestsModule {}
