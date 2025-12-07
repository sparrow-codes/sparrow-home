import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';
import { MqttClient } from '@nestjs/microservices/external/mqtt-client.interface';
import { debounceTime, Observable, Subject } from 'rxjs';

import { DeviceProfile } from '../model';
import { DeviceJoined } from '../model/device-joined';
import { DeviceState } from '../model/device-state';
import { toDevice } from './functions/to-device';
import { LocalStateService } from './local-state.service';

@Injectable()
export class ZigbeeDeviceService implements OnModuleInit {
  private readonly _client: MqttClient;
  private readonly _devices: Map<string, DeviceProfile> = new Map<string, DeviceProfile>();
  private readonly _deviceEvent: Subject<DeviceProfile> = new Subject();
  private readonly _logger: Logger = new Logger(ZigbeeDeviceService.name);

  private static readonly _BRIDGE_EVENT_URL: string = 'zigbee2mqtt/bridge/event';
  private static readonly _BRIDGE_DEVICES_URL: string = 'zigbee2mqtt/bridge/devices';
  private static readonly _REMOVE_DEVICE_URL: string = 'zigbee2mqtt/bridge/request/device/remove';
  private static readonly _BASE = 'zigbee2mqtt';

  public readonly devices: ReadonlyMap<string, DeviceProfile> = this._devices;
  public readonly deviceEvent$: Observable<DeviceProfile> = this._deviceEvent.asObservable().pipe(debounceTime(1000));

  public constructor(
    @Inject('ZIGBEE') private readonly _zigbeeClient: ClientMqtt,
    private readonly _localStateService: LocalStateService
  ) {
    this._client = this._zigbeeClient.createClient();
  }

  public onModuleInit(): void {
    this._client.on('connect', () => {
      this._logger.log(`MQTT connected`);
    });

    this._client.on('message', async (topic: string, payload: BufferSource) => {
      if (topic === ZigbeeDeviceService._BRIDGE_DEVICES_URL) {
        const cachedState: Map<string, DeviceState> | null = await this._localStateService.getState();
        const joinedDevices: DeviceJoined[] = JSON.parse(payload.toString());

        joinedDevices.forEach((device: DeviceJoined) => {
          const deviceProfile: DeviceProfile = toDevice(device);

          deviceProfile.state = cachedState?.get(deviceProfile.deviceIdentity.friendlyName) ?? {};
          this._devices.set(device.friendly_name, deviceProfile);
        });
      } else {
        const result: RegExpExecArray | null = new RegExp(
          `^${this._escapeChars(ZigbeeDeviceService._BASE)}/([^/]+)$`
        ).exec(topic);
        const friendlyName: string = result ? result[1] : '';

        if (friendlyName && this._devices.has(friendlyName)) {
          await this._updateDeviceState(
            this._devices.get(friendlyName) as DeviceProfile,
            JSON.parse(payload.toString())
          );
        }
      }
    });

    this._client.subscribe(ZigbeeDeviceService._BRIDGE_EVENT_URL);
    this._client.subscribe(ZigbeeDeviceService._BRIDGE_DEVICES_URL);
    this._client.subscribe(`${ZigbeeDeviceService._BASE}/+`);
    this._logger.log('Zigbee device service initialized');
  }

  public publishEvent(deviceId: string, payload: string): void {
    this._logger.log(`Publishing event: ${payload}`, deviceId);
    this._client.publish(`${ZigbeeDeviceService._BASE}/${deviceId}/set`, payload);
  }

  public async removeDevice(deviceId: string): Promise<void> {
    const cachedState: Map<string, DeviceState> | null = await this._localStateService.getState();

    if (cachedState) {
      cachedState.delete(deviceId);
      await this._localStateService.setState(cachedState);
    }

    this._client.publish(ZigbeeDeviceService._REMOVE_DEVICE_URL, JSON.stringify({ id: deviceId }));
    this._devices.delete(deviceId);
  }

  private async _updateDeviceState(deviceProfile: DeviceProfile, payload: Record<string, unknown>): Promise<void> {
    this._logger.log(`Updating device state: ${JSON.stringify(payload)}`, deviceProfile.deviceIdentity.friendlyName);
    const cachedState: Map<string, DeviceState> | null = await this._localStateService.getState();
    const state: DeviceState = {
      ...deviceProfile.state,
      ...payload,
    };

    const device: DeviceProfile = {
      ...deviceProfile,
      state,
    };

    if (cachedState) {
      cachedState.set(device.deviceIdentity.friendlyName, state);
      await this._localStateService.setState(cachedState);
    }

    this._devices.set(device.deviceIdentity.friendlyName, device);
    this._deviceEvent.next(device);
  }

  private _escapeChars(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
