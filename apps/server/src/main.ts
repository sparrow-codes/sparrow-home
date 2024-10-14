/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { Setup } from './app/modules/setup/enitites/setup';
import { ModeService } from './app/modules/setup/services/mode/mode.service';
import { SetupService } from './app/modules/setup/services/setup.service';

async function bootstrap(): Promise<void> {
  const app: NestApplication = await NestFactory.create(AppModule);
  const globalPrefix: string = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const setupService: SetupService = app.get(SetupService);
  const modeService: ModeService = app.get(ModeService);
  const setup: Setup | undefined = await setupService.getSetup();

  const port: number = +process.env.PORT || 3000;
  await app.listen(port).then(() => {
    if (setup && setup?.mode) {
      modeService.setMode(setup.mode, true);
    }
  });
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
