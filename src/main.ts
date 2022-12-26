import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.use(
      [configService.get('doc.path')],
      basicAuth({
          challenge: true,
          users: { admin: configService.get('doc.password') }
      }),
  );

  const options = new DocumentBuilder()
      .setTitle(configService.get('doc.title'))
      .setDescription(configService.get('doc.description'))
      .setVersion(configService.get('doc.version'))
      .addBearerAuth(
          {
            type: configService.get('doc.bearer.type'),
            scheme: configService.get('doc.bearer.scheme'),
            bearerFormat: configService.get('doc.bearer.format'),
            name: configService.get('doc.bearer.name'),
            description: configService.get('doc.bearer.description'),
            in: configService.get('doc.bearer.in'),
          },
          configService.get('doc.bearer.reference'),
      )
      .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(configService.get('doc.path'), app, document);

  await app.listen(configService.get('http.port'));
}

bootstrap();