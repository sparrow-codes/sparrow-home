import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigKey } from '@sparrow-server/shared';

import { ZigbeeManageDeviceService, ZigbeeSensorService, ZigbeeSirenService, ZigbeeSwitchMqttService } from './zigbee';
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
    ZigbeeSwitchMqttService,
    MqttConnectorService,
    ZigbeeManageDeviceService,
    ZigbeeSensorService,
    ZigbeeSirenService,
  ],
  exports: [ZigbeeSwitchMqttService, ZigbeeManageDeviceService, ZigbeeSensorService, ZigbeeSirenService],
})
export class ApiModule {}
