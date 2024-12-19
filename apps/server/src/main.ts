import { Logger, ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { AppInitService } from './app/init/app-init.service';

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
      new DocumentBuilder()
        .setTitle('Cats example')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addTag('cats')
        .build()
    )
  );

  await app.listen(port).then(() => initService.onInit());
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
