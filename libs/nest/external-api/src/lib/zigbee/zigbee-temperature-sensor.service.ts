import { Inject, Injectable } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';
import { MqttClient } from '@nestjs/microservices/external/mqtt-client.interface';
import { Observable, Subject } from 'rxjs';

import { DeviceResponse, SonoffTemperatureSensorDetails } from './model';

@Injectable()
export class ZigbeeTemperatureSensorService {
  private readonly _client: MqttClient;
  private readonly _sonoffTemperatureSensorDetails$: Subject<DeviceResponse<SonoffTemperatureSensorDetails>> =
    new Subject();

  public get sonoffTemperatureSensorDetails$(): Observable<DeviceResponse<SonoffTemperatureSensorDetails>> {
    return this._sonoffTemperatureSensorDetails$.asObservable();
  }

  public constructor(@Inject('ZIGBEE') private readonly _zigbeeClient: ClientMqtt) {
    this._zigbeeClient.connect();
    this._client = this._zigbeeClient.createClient();
  }

  public subscribeToTemperatureSensor(zigbeeDeviceId: string): void {
    const subscription: (_topic: string, message: BufferSource) => void = this._handleSensorResponse(zigbeeDeviceId);
    this._client.subscribe(`zigbee2mqtt/${zigbeeDeviceId}`, () => {
      this._client.on('message', subscription);
    });
  }

  public clearListeners(zigbeeDeviceIds: string[]): void {
    this._client.removeAllListeners();
    zigbeeDeviceIds.forEach((deviceId: string) => {
      this._client.unsubscribe(`zigbee2mqtt/${deviceId}`);
    });
  }

  private _handleSensorResponse(homeDeviceId: string) {
    return (_topic: string, message: BufferSource): void =>
      this._sonoffTemperatureSensorDetails$.next({ deviceId: homeDeviceId, payload: JSON.parse(message.toString()) });
  }
}
