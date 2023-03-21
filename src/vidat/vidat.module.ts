import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Delivery } from 'src/deliveries/models/delivery.model';
import { Item } from 'src/items/models/item.model';
import { Provider } from 'src/providers/models/provider.model';
import { Client } from 'src/clients/models/client.model';
import { VidatService } from './vidat.service';
import { VidatController } from './vidat.controller';

@Module({
  imports: [ConfigModule, SequelizeModule.forFeature([Delivery, Item, Provider, Client])],
  providers: [VidatService],
  controllers: [VidatController]
})
export class VidatModule {}
