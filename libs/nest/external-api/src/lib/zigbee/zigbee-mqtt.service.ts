import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import mqtt, { MqttClient } from 'mqtt';
import { catchError, combineLatest, first, map, Observable, of, Subject, timeout } from 'rxjs';

import { DeviceResponse } from './model';
import { IkeaSwitchStatusResponse } from './model';
import { IkeaSwitchRequest } from './model/ikea-switch-request';

@Injectable()
export class ZigbeeMqttService {
  private readonly _ikeaSwitchStatusResponse$: Subject<DeviceResponse<IkeaSwitchStatusResponse>> = new Subject();

  private static readonly _PARING_MODE_RUNTIME: number = 120;
  private static readonly _ZIGBEE_MQTT_BRIDGE_REQUEST_URL: string = 'zigbee2mqtt/bridge/request/permit_join';
  private static readonly _DEVICE_CONNECTION_TIMEOUT: number = 5000;

  private readonly client: MqttClient;

  public constructor(private readonly configService: ConfigService) {
    this.client = mqtt.connect(this.configService.get<string>(ConfigKey.MQTT_URL) ?? '');
  }

  public async allowDeviceJoin(): Promise<void> {
    await this.client.publishAsync(
      ZigbeeMqttService._ZIGBEE_MQTT_BRIDGE_REQUEST_URL,
      this._toMessage({ time: ZigbeeMqttService._PARING_MODE_RUNTIME })
    );
  }

  public setSwitchOn(homeDeviceId: string, isOn: boolean, onTime?: number): Observable<boolean> {
    const request: IkeaSwitchRequest = { state: isOn ? 'ON' : 'OFF', on_time: onTime };

    this.client.subscribe(`zigbee2mqtt/${homeDeviceId}`);
    this.client.on('message', (_topic: string, message) => {
      this._ikeaSwitchStatusResponse$.next({ deviceId: homeDeviceId, payload: JSON.parse(message.toString()) });
      this.client.unsubscribe(`zigbee2mqtt/${homeDeviceId}`);
    });

    return combineLatest([
      this.client.publishAsync(`zigbee2mqtt/${homeDeviceId}/set`, this._toMessage(request)),
      this._ikeaSwitchStatusResponse$.asObservable().pipe(first()),
    ]).pipe(map(([, response]) => response.payload.state === 'ON'));
  }

  public getSwitchStatus(homeDeviceId: string): Observable<DeviceResponse<IkeaSwitchStatusResponse> | null> {
    const request: IkeaSwitchRequest = { state: '' };

    this.client.subscribe(`zigbee2mqtt/${homeDeviceId}`);
    this.client.on('message', (_topic: string, message) => {
      this._ikeaSwitchStatusResponse$.next({ deviceId: homeDeviceId, payload: JSON.parse(message.toString()) });
      this.client.unsubscribe(`zigbee2mqtt/${homeDeviceId}`);
    });

    return combineLatest([
      this.client.publishAsync(`zigbee2mqtt/${homeDeviceId}/get`, this._toMessage(request)),
      this._ikeaSwitchStatusResponse$.asObservable().pipe(
        timeout(ZigbeeMqttService._DEVICE_CONNECTION_TIMEOUT),
        first(),
        catchError(() => of(null))
      ),
    ]).pipe(map(([, response]) => response));
  }

  private _toMessage(request: object): Buffer {
    return Buffer.from(JSON.stringify(request), 'utf8');
  }
}
