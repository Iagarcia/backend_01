import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProvidersModule } from './providers/providers.module';
import { ClientsModule } from './clients/clients.module';
import { ServicesModule } from './services/services.module';
import { ContractsModule } from './contracts/contracts.module';
import { SchedulesModule } from './schedules/schedules.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'vidat',
      password: 'v1d4t',
      database: 'vidat',
      autoLoadModels: true,
      synchronize: true,
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
