import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Provider } from './models/provider.model';
import { ProvidersController } from "./providers.controller";
import { ProvidersService } from "./providers.service";

@Module({
    imports: [ConfigModule, SequelizeModule.forFeature([Provider])],
    controllers:[ProvidersController],
    providers:[ProvidersService],
    exports:[ProvidersService]
})
export class ProvidersModule {}
