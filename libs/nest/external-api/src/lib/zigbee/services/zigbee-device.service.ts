import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';
import { MqttClient } from '@nestjs/microservices/external/mqtt-client.interface';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';

import { DeviceProfile } from '../model';
import { DeviceJoined } from '../model/device-joined';
import { DeviceState } from '../model/device-state';
import { toDevice } from './functions/to-device';
import { LocalStateService } from './local-state.service';

@Injectable()
export class ZigbeeDeviceService implements OnModuleInit, OnModuleDestroy {
  private _cachedState: Map<string, DeviceState> = new Map();

  private readonly _client: MqttClient;
  private readonly _devices: Map<string, DeviceProfile> = new Map<string, DeviceProfile>();
  private readonly _deviceEvent: Subject<DeviceProfile> = new Subject();
  private readonly _logger: Logger = new Logger(ZigbeeDeviceService.name);
  private readonly _stateUpdated: Subject<void> = new Subject();
  private readonly _destroy: Subject<void> = new Subject();

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

  public async onModuleInit(): Promise<void> {
    this._cachedState = await this._localStateService.getState();
    this._stateUpdated
      .pipe(takeUntil(this._destroy), debounceTime(10000))
      .subscribe(() => this._localStateService.setState(this._cachedState));

    this._client.on('connect', () => {
      this._logger.log(`MQTT connected`);
    });

    this._client.on('message', (topic: string, payload: BufferSource) => {
      if (topic === ZigbeeDeviceService._BRIDGE_DEVICES_URL) {
        const joinedDevices: DeviceJoined[] = JSON.parse(payload.toString());

        joinedDevices.forEach((device: DeviceJoined) => {
          const deviceProfile: DeviceProfile = toDevice(device);

          deviceProfile.state = this._cachedState.get(deviceProfile.deviceIdentity.friendlyName) ?? {};
          this._devices.set(device.friendly_name, deviceProfile);
        });
      } else {
        const result: RegExpExecArray | null = new RegExp(
          `^${this._escapeChars(ZigbeeDeviceService._BASE)}/([^/]+)$`
        ).exec(topic);
        const friendlyName: string = result ? result[1] : '';

        if (friendlyName && this._devices.has(friendlyName)) {
          this._updateDeviceState(this._devices.get(friendlyName) as DeviceProfile, JSON.parse(payload.toString()));
        }
      }
    });

    this._client.subscribe(ZigbeeDeviceService._BRIDGE_EVENT_URL);
    this._client.subscribe(ZigbeeDeviceService._BRIDGE_DEVICES_URL);
    this._client.subscribe(`${ZigbeeDeviceService._BASE}/+`);
    this._logger.log('Zigbee device service initialized');
  }

  public onModuleDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  public publishEvent(deviceId: string, payload: string): void {
    this._logger.log(`Publishing event: ${payload}`, deviceId);
    this._client.publish(`${ZigbeeDeviceService._BASE}/${deviceId}/set`, payload);
  }

  public removeDevice(deviceId: string): void {
    this._cachedState.delete(deviceId);
    this._stateUpdated.next();

    this._client.publish(ZigbeeDeviceService._REMOVE_DEVICE_URL, JSON.stringify({ id: deviceId }));
    this._devices.delete(deviceId);
  }

  private _updateDeviceState(deviceProfile: DeviceProfile, payload: Record<string, unknown>): void {
    const state: DeviceState = {
      ...deviceProfile.state,
      ...payload,
    };

    const device: DeviceProfile = {
      ...deviceProfile,
      state,
    };

    this._cachedState.set(device.deviceIdentity.friendlyName, state);
    this._stateUpdated.next();

    this._devices.set(device.deviceIdentity.friendlyName, device);
    this._deviceEvent.next(device);
  }

  private _escapeChars(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
