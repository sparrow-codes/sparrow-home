import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ComfortCloudConnector } from './panasonic';
import { OAuthClient } from './panasonic/oauth-connector/OAuthConnector';
import { WeatherApiService } from './weather/weather-api.service';
import { ZigbeeManageDeviceService, ZigbeeSwitchMqttService } from './zigbee';
import { MqttConnectorService } from './zigbee/connector/mqtt-connector.service';

@Module({
  imports: [HttpModule],
  providers: [
    WeatherApiService,
    ComfortCloudConnector,
    OAuthClient,
    ZigbeeSwitchMqttService,
    MqttConnectorService,
    ZigbeeManageDeviceService,
  ],
  exports: [WeatherApiService, ComfortCloudConnector, ZigbeeSwitchMqttService, ZigbeeManageDeviceService],
})
export class ApiModule {}
