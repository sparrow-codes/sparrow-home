import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { TuyaApiService } from './tuya';
import { WeatherApiService } from './weather/weather-api.service';

@Module({
  imports: [HttpModule],
  providers: [WeatherApiService, TuyaApiService],
  exports: [WeatherApiService, TuyaApiService],
})
export class ApiModule {}
