import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ComfortCloudConnector } from './panasonic';
import { OAuthClient } from './panasonic/oauth-connector/OAuthConnector';
import { WeatherApiService } from './weather/weather-api.service';
import { ZigbeeSwitchMqttService } from './zigbee';
import { MqttConnectorService } from './zigbee/connector/mqtt-connector.service';

@Module({
  imports: [HttpModule],
  providers: [WeatherApiService, ComfortCloudConnector, OAuthClient, ZigbeeSwitchMqttService, MqttConnectorService],
  exports: [WeatherApiService, ComfortCloudConnector, ZigbeeSwitchMqttService],
})
export class ApiModule {}
