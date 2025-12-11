import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigKey } from '@sparrow-server/shared';

import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const logger: Logger = new Logger('Main');
  const app: NestApplication = await NestFactory.create(AppModule);
  const globalPrefix: string = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService: ConfigService = app.get(ConfigService);
  const port: number = +process.env.PORT || 3000;
  const isDevelopment: boolean = configService.get<'development' | 'production'>(ConfigKey.MODE) === 'development';

  if (isDevelopment) {
    logger.log('Setting up development environment');

    app.enableCors();

    SwaggerModule.setup('api', app, () =>
      SwaggerModule.createDocument(app, new DocumentBuilder().addBearerAuth().setVersion('1.0').build())
    );
  }

  await app.listen(port).then(() => {
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  });
}

bootstrap();
