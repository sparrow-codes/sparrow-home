import { HttpModule } from '@nestjs/axios';
import { Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientMqtt, ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigKey } from '@sparrow-server/shared';

import { ZigbeeDeviceService, ZigbeeManageDeviceService } from './zigbee';
import { MqttConnectorService } from './zigbee/connector/mqtt-connector.service';
import { LocalStateService } from './zigbee/services/local-state.service';

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
  providers: [MqttConnectorService, ZigbeeManageDeviceService, ZigbeeDeviceService, LocalStateService],
  exports: [ZigbeeManageDeviceService, ZigbeeDeviceService],
})
export class ApiModule implements OnModuleInit {
  private readonly _logger = new Logger(ApiModule.name);

  public constructor(@Inject('ZIGBEE') private readonly _zigbeeClient: ClientMqtt) {}

  public async onModuleInit(): Promise<void> {
    await this._zigbeeClient
      .connect()
      .then(() => this._logger.log('Connected to MQTT'))
      .catch((e) => {
        this._logger.error('Error connecting to MQTT', e);
      });
  }
}
