import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigKey } from '@sparrow-server/shared';

import { ComfortCloudConnector } from './panasonic';
import { OAuthClient } from './panasonic/oauth-connector/OAuthConnector';
import { WeatherApiService } from './weather/weather-api.service';
import { ZigbeeManageDeviceService, ZigbeeSwitchMqttService } from './zigbee';
import { ZigbeeSensorService } from './zigbee';
import { MqttConnectorService } from './zigbee/connector/mqtt-connector.service';

@Module({
  imports: [
    HttpModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'ZIGBEE',
        useFactory: (configService: ConfigService): object => ({
          transport: Transport.MQTT,
          options: {
            encoding: 'utf8',
            url: configService.get<string>(ConfigKey.MQTT_URL),
            protocol: 'mqtt',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    WeatherApiService,
    ComfortCloudConnector,
    OAuthClient,
    ZigbeeSwitchMqttService,
    MqttConnectorService,
    ZigbeeManageDeviceService,
    ZigbeeSensorService,
  ],
  exports: [
    WeatherApiService,
    ComfortCloudConnector,
    ZigbeeSwitchMqttService,
    ZigbeeManageDeviceService,
    ZigbeeSensorService,
  ],
})
export class ApiModule {}
