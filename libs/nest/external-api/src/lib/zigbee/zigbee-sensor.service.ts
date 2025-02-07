import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';
import { MqttClient } from '@nestjs/microservices/external/mqtt-client.interface';
import { distinctUntilChanged, Observable, Subject } from 'rxjs';

import { DeviceResponse, SensorDetails } from './model';

@Injectable()
export class ZigbeeSensorService {
  private readonly _client: MqttClient;
  private readonly _sensorDetails$: Subject<DeviceResponse<SensorDetails>> = new Subject();

  public get sensorDetails$(): Observable<DeviceResponse<SensorDetails>> {
    return this._sensorDetails$
      .asObservable()
      .pipe(distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current)));
  }

  public constructor(@Inject('ZIGBEE') private readonly _zigbeeClient: ClientMqtt) {
    this._zigbeeClient.connect();
    this._client = this._zigbeeClient.createClient();
  }

  public subscribeToSensor(zigbeeDeviceId: string): void {
    const subscription: (topic: string, message: BufferSource) => void = this._handleSensorResponse();
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

  private _handleSensorResponse() {
    return (topic: string, message: BufferSource): void =>
      this._sensorDetails$.next({
        deviceId: this._getDeviceMessageFromTopic(topic),
        payload: JSON.parse(message.toString()),
      });
  }

  private _getDeviceMessageFromTopic(topic: string): string {
    const deviceId: string | undefined = topic.split('/')[1];
    if (!deviceId) {
      Logger.warn(`Invalid topic format ${topic}`);
      return '';
    }

    return deviceId;
  }
}
