import { Inject, Injectable } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';
import { MqttClient } from '@nestjs/microservices/external/mqtt-client.interface';
import { catchError, combineLatest, first, map, Observable, of, Subject, tap, timeout } from 'rxjs';

import { DeviceResponse, IkeaSwitchStatusResponse } from './model';
import { IkeaSwitchRequest } from './model/ikea-switch-request';

@Injectable()
export class ZigbeeSwitchMqttService {
  private readonly _ikeaSwitchStatusResponse$: Subject<DeviceResponse<IkeaSwitchStatusResponse>> = new Subject();

  private static readonly _DEVICE_CONNECTION_TIMEOUT: number = 5000;
  private static readonly _MAXIMUM_IKEA_TIMER_VALUE: number = 6553;

  private readonly _client: MqttClient;

  public constructor(@Inject('ZIGBEE') private readonly _zigbeeClient: ClientMqtt) {
    this._zigbeeClient.connect();
    this._client = this._zigbeeClient.createClient();
  }

  public setSwitchOn(homeDeviceId: string, isOn: boolean, onTime?: number): Observable<boolean> {
    const request: IkeaSwitchRequest = {
      state: isOn ? 'ON' : 'OFF',
      on_time: this._mapOnTimeSwitch(onTime),
    };

    const subscription: (_topic: string, message: BufferSource) => void = this._handleSwitchResponse(homeDeviceId);

    this._client.subscribe(`zigbee2mqtt/${homeDeviceId}`, () => {
      this._client.on('message', subscription);
    });

    return combineLatest([
      of(this._client.publish(`zigbee2mqtt/${homeDeviceId}/set`, JSON.stringify(request))),
      this._ikeaSwitchStatusResponse$.asObservable().pipe(
        first(),
        tap(() => this._client.removeListener('message', subscription))
      ),
    ]).pipe(
      map(([, response]) => response.payload.state === 'ON'),
      tap(() => {
        this._client.unsubscribe(`zigbee2mqtt/${homeDeviceId}`);
      })
    );
  }

  public getSwitchStatus(homeDeviceId: string): Observable<DeviceResponse<IkeaSwitchStatusResponse> | null> {
    const request: IkeaSwitchRequest = { state: '' };
    const subscription: (_topic: string, message: BufferSource) => void = this._handleSwitchResponse(homeDeviceId);

    this._client.subscribe(`zigbee2mqtt/${homeDeviceId}`, () => {
      this._client.on('message', subscription);
    });

    return combineLatest([
      of(this._client.publish(`zigbee2mqtt/${homeDeviceId}/get`, JSON.stringify(request))),
      this._ikeaSwitchStatusResponse$.asObservable().pipe(
        timeout(ZigbeeSwitchMqttService._DEVICE_CONNECTION_TIMEOUT),
        first(),
        catchError(() => of(null)),
        tap(() => this._client.removeListener('message', subscription))
      ),
    ]).pipe(
      map(([, response]) => response),
      tap(() => {
        this._client.unsubscribe(`zigbee2mqtt/${homeDeviceId}`);
      })
    );
  }

  private _handleSwitchResponse(homeDeviceId: string) {
    return (_topic: string, message: BufferSource): void =>
      this._ikeaSwitchStatusResponse$.next({ deviceId: homeDeviceId, payload: JSON.parse(message.toString()) });
  }

  private _mapOnTimeSwitch(onTime?: number): number | undefined {
    if (!onTime) {
      return undefined;
    }

    if (onTime > ZigbeeSwitchMqttService._MAXIMUM_IKEA_TIMER_VALUE) {
      return onTime / 10;
    } else {
      return onTime;
    }
  }
}
