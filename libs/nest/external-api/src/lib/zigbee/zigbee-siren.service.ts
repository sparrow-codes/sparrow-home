import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';
import { MqttClient } from '@nestjs/microservices/external/mqtt-client.interface';

@Injectable()
export class ZigbeeSirenService {
  private readonly _client: MqttClient;
  private static readonly _SIREN_DURATION: number = 360;

  public constructor(@Inject('ZIGBEE') private readonly _zigbeeClient: ClientMqtt) {
    this._zigbeeClient.connect();
    this._client = this._zigbeeClient.createClient();
  }

  public setAlarm(zigbeeDeviceId: string, isOn: boolean): void {
    Logger.log(`Setting alarm for siren ${zigbeeDeviceId}`);
    this._client.publish(
      `zigbee2mqtt/${zigbeeDeviceId}/set`,
      JSON.stringify({
        warning: {
          duration: isOn ? ZigbeeSirenService._SIREN_DURATION : 0,
          mode: isOn ? 'burglar' : 'stop',
          level: 'very_high',
        },
      })
    );
  }
}
