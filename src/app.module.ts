import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './app.config';

import { ProvidersModule } from './providers/providers.module';
import { ClientsModule } from './clients/clients.module';
import { ItemsModule } from './items/items.module';

import { Provider } from './providers/models/provider.model';
import { Client } from './clients/models/client.model';
import { Item } from './items/models/item.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('db.host'),
        port: configService.get('db.port'),
        username: configService.get('db.username'),
        password: configService.get('db.password'),
        database: configService.get('db.database'),
        models: [Provider, Item, Client],
        autoLoadModels: true,
        synchronize: true,
      }),
      inject: [ConfigService]
    }),
    ProvidersModule,
    ClientsModule,
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
