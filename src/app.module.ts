import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProvidersModule } from './providers/providers.module';
import { ClientsModule } from './clients/clients.module';
import { ServicesModule } from './services/services.module';
import { ContractsModule } from './contracts/contracts.module';
import { SchedulesModule } from './schedules/schedules.module';
import { Provider } from './providers/models/provider.model';
import { Service } from './services/models/service.model';
import { Schedule } from './schedules/models/schedule.model';
import { Contract } from './contracts/models/contract.model';
import { Client } from './clients/models/client.model';
import configuration from './config/configuration';

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
        models: [Provider, Service, Schedule, Contract, Client],
        autoLoadModels: true,
        synchronize: true,
      }),
      inject: [ConfigService]
    }),
    ProvidersModule,
    ServicesModule,
    ClientsModule,
    ContractsModule,
    SchedulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
