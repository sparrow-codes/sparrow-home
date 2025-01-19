import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import mqtt, { MqttClient } from 'mqtt';

@Injectable()
export class MqttConnectorService {
  private readonly _client: MqttClient;

  public get client(): MqttClient {
    return this._client;
  }

  public constructor(private readonly configService: ConfigService) {
    this._client = mqtt.connect(this.configService.get<string>(ConfigKey.MQTT_URL) ?? '');
  }

  public toMessage(request: object): Buffer {
    return Buffer.from(JSON.stringify(request), 'utf8');
  }
}
