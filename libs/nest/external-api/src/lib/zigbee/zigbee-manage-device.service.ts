import { Injectable, Logger } from '@nestjs/common';
import { MqttClient } from 'mqtt';
import { catchError, combineLatest, map, Observable, of, Subject, timeout } from 'rxjs';

import { MqttConnectorService } from './connector/mqtt-connector.service';
import { BridgeEventMessage } from './model/bridge-event.message';

@Injectable()
export class ZigbeeManageDeviceService {
  private readonly _bridgeEventMessage$: Subject<BridgeEventMessage> = new Subject();

  private static readonly _PARING_MODE_RUNTIME: number = 30;
  private static readonly _BRIDGE_EVENT_URL: string = 'zigbee2mqtt/bridge/event';
  private static readonly _ZIGBEE_MQTT_BRIDGE_REQUEST_URL: string = 'zigbee2mqtt/bridge/request';

  private readonly client: MqttClient;

  public constructor(private readonly mqttService: MqttConnectorService) {
    this.client = this.mqttService.client;
  }

  public joinDeviceAndSetId(): Observable<string | null> {
    this.client.subscribe(ZigbeeManageDeviceService._BRIDGE_EVENT_URL);
    this.client.on('message', (_topic, message) => {
      this._bridgeEventMessage$.next(JSON.parse(message.toString()));
      this.client.unsubscribe(ZigbeeManageDeviceService._BRIDGE_EVENT_URL);
    });

    return combineLatest([
      this.client.publishAsync(
        `${ZigbeeManageDeviceService._ZIGBEE_MQTT_BRIDGE_REQUEST_URL}/permit_join`,
        this.mqttService.toMessage({ time: ZigbeeManageDeviceService._PARING_MODE_RUNTIME })
      ),
      this._bridgeEventMessage$.asObservable(),
    ]).pipe(
      timeout(ZigbeeManageDeviceService._PARING_MODE_RUNTIME * 1000),
      map(([, response]) => response.data.friendly_name),
      catchError(() => {
        Logger.log('Timeout - no device was added');
        return of(null);
      })
    );
  }

  public async removeDevice(deviceId: string): Promise<void> {
    this.client.publish(
      `${ZigbeeManageDeviceService._ZIGBEE_MQTT_BRIDGE_REQUEST_URL}/device/remove`,
      this.mqttService.toMessage({ id: deviceId })
    );
  }
}
