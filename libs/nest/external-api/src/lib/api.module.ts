import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ComfortCloudConnector } from './panasonic';
import { OAuthClient } from './panasonic/oauth-connector/OAuthConnector';
import { WeatherApiService } from './weather/weather-api.service';
import { ZigbeeMqttService } from './zigbee';

@Module({
  imports: [HttpModule],
  providers: [WeatherApiService, ComfortCloudConnector, OAuthClient, ZigbeeMqttService],
  exports: [WeatherApiService, ComfortCloudConnector, ZigbeeMqttService],
})
export class ApiModule {}
