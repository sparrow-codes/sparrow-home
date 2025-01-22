import { Injectable } from '@nestjs/common';
import { MqttClient } from 'mqtt';
import { catchError, combineLatest, first, map, Observable, of, Subject, timeout } from 'rxjs';

import { MqttConnectorService } from './connector/mqtt-connector.service';
import { DeviceResponse, IkeaSwitchStatusResponse } from './model';
import { IkeaSwitchRequest } from './model/ikea-switch-request';

@Injectable()
export class ZigbeeSwitchMqttService {
  private readonly _ikeaSwitchStatusResponse$: Subject<DeviceResponse<IkeaSwitchStatusResponse>> = new Subject();

  private static readonly _DEVICE_CONNECTION_TIMEOUT: number = 5000;

  private readonly client: MqttClient;

  public constructor(private readonly mqttService: MqttConnectorService) {
    this.client = this.mqttService.client;
  }

  public setSwitchOn(homeDeviceId: string, isOn: boolean, onTime?: number): Observable<boolean> {
    const request: IkeaSwitchRequest = {
      state: isOn ? 'ON' : 'OFF',
      on_time: onTime,
    };

    this.client.subscribe(`zigbee2mqtt/${homeDeviceId}`);
    this.client.on('message', (_topic: string, message) => {
      this._ikeaSwitchStatusResponse$.next({ deviceId: homeDeviceId, payload: JSON.parse(message.toString()) });
      this.client.unsubscribe(`zigbee2mqtt/${homeDeviceId}`);
    });

    return combineLatest([
      this.client.publishAsync(`zigbee2mqtt/${homeDeviceId}/set`, this.mqttService.toMessage(request)),
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
      this.client.publishAsync(`zigbee2mqtt/${homeDeviceId}/get`, this.mqttService.toMessage(request)),
      this._ikeaSwitchStatusResponse$.asObservable().pipe(
        timeout(ZigbeeSwitchMqttService._DEVICE_CONNECTION_TIMEOUT),
        first(),
        catchError(() => of(null))
      ),
    ]).pipe(map(([, response]) => response));
  }
}
