import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize';

export const DatabaseModule = [
    {
      provide: 'SEQUELIZE',
      inject: [ConfigService], //no worries for imports because you're using a global module
      useFactory: async (configService: ConfigService) => {
        const sequelize = new Sequelize({
            dialect: 'postgres',
            host: configService.get<string>('database.host'),
            port: configService.get<number>('database.port'),
            username: configService.get<string>('database.username'),
            password: configService.get<string>('database.password'),
            database: configService.get<string>('database.database')
        });
        return sequelize;
      }
    }
  ];