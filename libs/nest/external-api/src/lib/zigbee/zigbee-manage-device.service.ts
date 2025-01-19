import { Injectable } from '@nestjs/common';
import { MqttClient } from 'mqtt';

import { MqttConnectorService } from './connector/mqtt-connector.service';

@Injectable()
export class ZigbeeManageDeviceService {
  private static readonly _PARING_MODE_RUNTIME: number = 120;
  private static readonly _ZIGBEE_MQTT_BRIDGE_REQUEST_URL: string = 'zigbee2mqtt/bridge/request';

  private readonly client: MqttClient;

  public constructor(private readonly mqttService: MqttConnectorService) {
    this.client = this.mqttService.client;
  }

  public async allowDeviceJoin(): Promise<void> {
    await this.client.publishAsync(
      `${ZigbeeManageDeviceService._ZIGBEE_MQTT_BRIDGE_REQUEST_URL}/permit_join`,
      this.mqttService.toMessage({ time: ZigbeeManageDeviceService._PARING_MODE_RUNTIME })
    );
  }

  public async removeDevice(deviceId: string): Promise<void> {
    this.client.publish(
      `${ZigbeeManageDeviceService._ZIGBEE_MQTT_BRIDGE_REQUEST_URL}/device/remove`,
      this.mqttService.toMessage({ id: deviceId })
    );
  }
}
