import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { Delivery } from './models/delivery.model';
import { Item } from 'src/items/models/item.model';
import { Request } from 'src/requests/models/request.model';
import { Provider } from 'src/providers/models/provider.model';
import { Client } from 'src/clients/models/client.model';

import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';

@Module({
  imports: [ConfigModule, SequelizeModule.forFeature([
    Delivery,
    Item,
    Request,
    Provider,
    Client
  ])],
  controllers: [DeliveriesController],
  providers: [DeliveriesService]
})
export class DeliveriesModule {}
