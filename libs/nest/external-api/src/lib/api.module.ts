import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ComfortCloudConnector } from './panasonic';
import { OAuthClient } from './panasonic/oauth-connector/OAuthConnector';
import { TuyaApiService } from './tuya';
import { WeatherApiService } from './weather/weather-api.service';

@Module({
  imports: [HttpModule],
  providers: [WeatherApiService, TuyaApiService, ComfortCloudConnector, OAuthClient],
  exports: [WeatherApiService, TuyaApiService, ComfortCloudConnector],
})
export class ApiModule {}
