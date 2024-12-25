import { Logger, ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppInitService } from '@sparrow-server/init';

import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const app: NestApplication = await NestFactory.create(AppModule);
  const globalPrefix: string = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const initService: AppInitService = app.get(AppInitService);
  const port: number = +process.env.PORT || 3000;

  SwaggerModule.setup('api', app, () =>
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder().addBearerAuth().setVersion('1.0').build()
    )
  );

  await app.listen(port).then(() => initService.onInit());
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
