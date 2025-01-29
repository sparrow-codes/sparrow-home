import { Injectable, Logger } from '@nestjs/common';
import { MqttClient } from 'mqtt';
import { catchError, combineLatest, first, from, map, Observable, Subject, tap, timeout } from 'rxjs';

import { MqttConnectorService } from './connector/mqtt-connector.service';
import { BridgeEventMessage } from './model/bridge-event.message';

@Injectable()
export class ZigbeeManageDeviceService {
  private readonly _bridgeEventMessage$: Subject<BridgeEventMessage> = new Subject();

  private static readonly _PARING_MODE_RUNTIME: number = 60;
  private static readonly _BRIDGE_EVENT_URL: string = 'zigbee2mqtt/bridge/event';
  private static readonly _ZIGBEE_MQTT_BRIDGE_REQUEST_URL: string = 'zigbee2mqtt/bridge/request';

  private readonly client: MqttClient;

  public constructor(private readonly mqttService: MqttConnectorService) {
    this.client = this.mqttService.client;
  }

  public joinDeviceAndSetId(): Observable<string | null> {
    const subscription: (_topic: string, message: BufferSource) => void = this._handleEventMessage();

    this.client.subscribe(ZigbeeManageDeviceService._BRIDGE_EVENT_URL);
    this.client.on('message', subscription);

    return combineLatest([
      this.client.publishAsync(
        `${ZigbeeManageDeviceService._ZIGBEE_MQTT_BRIDGE_REQUEST_URL}/permit_join`,
        this.mqttService.toMessage({ time: ZigbeeManageDeviceService._PARING_MODE_RUNTIME })
      ),
      this._bridgeEventMessage$.asObservable().pipe(
        first(),
        tap(() => this.client.removeListener('message', subscription))
      ),
    ]).pipe(
      timeout(ZigbeeManageDeviceService._PARING_MODE_RUNTIME * 1000),
      map(([, response]) => response.data.friendly_name),
      catchError(() => {
        Logger.log('Timeout - no device was added');

        return from(
          this.client.publishAsync(
            `${ZigbeeManageDeviceService._ZIGBEE_MQTT_BRIDGE_REQUEST_URL}/permit_join`,
            this.mqttService.toMessage({ time: 0 })
          )
        ).pipe(map(() => null));
      }),
      tap(() => this.client.unsubscribe(ZigbeeManageDeviceService._BRIDGE_EVENT_URL))
    );
  }

  public async removeDevice(deviceId: string): Promise<void> {
    this.client.publish(
      `${ZigbeeManageDeviceService._ZIGBEE_MQTT_BRIDGE_REQUEST_URL}/device/remove`,
      this.mqttService.toMessage({ id: deviceId })
    );
  }

  private _handleEventMessage() {
    return (_topic: string, message: BufferSource): void => {
      const bridgeEventMessage: BridgeEventMessage = JSON.parse(message.toString());
      if (bridgeEventMessage.type === 'device_interview' && bridgeEventMessage.data.status === 'successful') {
        this._bridgeEventMessage$.next(bridgeEventMessage);
        this.client.unsubscribe(ZigbeeManageDeviceService._BRIDGE_EVENT_URL);
        Logger.log('Successfully joined device!');

        this.client.publish(
          `${ZigbeeManageDeviceService._ZIGBEE_MQTT_BRIDGE_REQUEST_URL}/permit_join`,
          this.mqttService.toMessage({ time: 0 })
        );
      }
    };
  }
}
