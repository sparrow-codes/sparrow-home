import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { LscSwitchApiService } from './tuya';
import { WeatherApiService } from './weather/weather-api.service';

@Module({
  imports: [HttpModule],
  providers: [WeatherApiService, LscSwitchApiService],
  exports: [WeatherApiService, LscSwitchApiService],
})
export class ApiModule {}
