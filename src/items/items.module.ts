import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Item } from './models/item.model';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  imports: [ConfigModule, SequelizeModule.forFeature([Item])],
  controllers: [ItemsController],
  providers: [ItemsService]
})
export class ItemsModule {}
