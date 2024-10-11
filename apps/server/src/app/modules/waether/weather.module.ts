import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { SetupModule } from '../setup/setup.module';
import { WeatherApiService } from './api/weather-api.service';
import { WeatherController } from './controllers/weather.controller';
import { WeatherService } from './services/weather.service';

@Module({
  imports: [SetupModule, HttpModule, AuthModule],
  providers: [WeatherApiService, WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
