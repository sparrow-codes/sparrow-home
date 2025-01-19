import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ComfortCloudConnector } from './panasonic';
import { OAuthClient } from './panasonic/oauth-connector/OAuthConnector';
import { WeatherApiService } from './weather/weather-api.service';
import { ZigbeeSwitchMqttService } from './zigbee';

@Module({
  imports: [HttpModule],
  providers: [WeatherApiService, ComfortCloudConnector, OAuthClient, ZigbeeSwitchMqttService],
  exports: [WeatherApiService, ComfortCloudConnector, ZigbeeSwitchMqttService],
})
export class ApiModule {}
