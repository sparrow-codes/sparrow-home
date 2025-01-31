import { Inject, Injectable } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';
import { MqttClient } from '@nestjs/microservices/external/mqtt-client.interface';
import { Observable, Subject } from 'rxjs';

import { DeviceResponse, SensorDetails } from './model';

@Injectable()
export class ZigbeeSensorService {
  private readonly _client: MqttClient;
  private readonly _sensorDetails$: Subject<DeviceResponse<SensorDetails>> = new Subject();

  public get sensorDetails$(): Observable<DeviceResponse<SensorDetails>> {
    return this._sensorDetails$.asObservable();
  }

  public constructor(@Inject('ZIGBEE') private readonly _zigbeeClient: ClientMqtt) {
    this._zigbeeClient.connect();
    this._client = this._zigbeeClient.createClient();
  }

  public subscribeToSensor(zigbeeDeviceId: string): void {
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
      this._sensorDetails$.next({ deviceId: homeDeviceId, payload: JSON.parse(message.toString()) });
  }
}
