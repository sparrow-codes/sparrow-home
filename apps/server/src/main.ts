import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigKey } from '@sparrow-server/shared';

import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const app: NestApplication = await NestFactory.create(AppModule);
  const globalPrefix: string = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  const configService: ConfigService = app.get(ConfigService);
  const port: number = +process.env.PORT || 3000;

  if (configService.get<'development' | 'production'>(ConfigKey.MODE) === 'development') {
    SwaggerModule.setup('api', app, () =>
      SwaggerModule.createDocument(app, new DocumentBuilder().addBearerAuth().setVersion('1.0').build())
    );
  }

  await app.listen(port).then(() => {
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  });
}

bootstrap();
