import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceType, HomeDevice } from '@sparrow-server/entities';
import { DeviceProfile, ZigbeeDeviceService } from '@sparrow-server/external-api';
import { PushNotificationService } from '@sparrow-server/push';
import { distinctUntilChanged, filter, Subject, takeUntil } from 'rxjs';
import { Repository } from 'typeorm';

import { GetAlarmModeResponse } from '../controller/model/get-alarm-mode.response';

@Injectable()
export class AlarmService implements OnModuleInit, OnModuleDestroy {
  private _isAlarmActive: boolean = false;
  private _ignoredDevices: Set<string> = new Set();
  private _sirenIsActive: boolean = false;

  private readonly _logger = new Logger(AlarmService.name);
  private readonly _destroy$: Subject<void> = new Subject();

  private static readonly _SIREN_DURATION: number = 360;

  public constructor(
    private readonly _zigbeeDeviceService: ZigbeeDeviceService,
    private readonly _pushNotificationService: PushNotificationService,
    @InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>
  ) {}

  public onModuleInit(): void {
    this._zigbeeDeviceService.deviceEvent$
      .pipe(
        takeUntil(this._destroy$),
        filter(() => this._isAlarmActive),
        distinctUntilChanged((prev, next) => JSON.stringify(prev.state) === JSON.stringify(next.state))
      )
      .subscribe((deviceProfile) => this._handleSensorEvent(deviceProfile));
  }

  public onModuleDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public async setAlarmMode(isActive: boolean): Promise<void> {
    if (isActive) {
      await this._updateIgnoredDevices();
    } else {
      await this._setSirensMode(false);
      this._ignoredDevices.clear();
    }

    this._logger.log(isActive ? 'Alarm is on!' : 'Alarm is off!');
    this._isAlarmActive = isActive;
  }

  public async getAlarmMode(): Promise<GetAlarmModeResponse> {
    const siren: HomeDevice | null = await this._homeDeviceRepository.findOneBy({ deviceType: DeviceType.SIREN });

    return { isActive: this._isAlarmActive, isAvailable: siren !== null };
  }

  private async _handleSensorEvent(deviceProfile: DeviceProfile): Promise<void> {
    const zigbeeDeviceId: string = deviceProfile.deviceIdentity.friendlyName;
    const homeDevice: HomeDevice | null = await this._homeDeviceRepository.findOneBy({
      zigbeeDeviceId,
    });

    if (this._shouldIgnoreSensor(zigbeeDeviceId) || !homeDevice) return;

    if (this._isOpenDoorTriggered(homeDevice, deviceProfile, this._isAlarmActive)) {
      await this._triggerAlarm(homeDevice);
    } else if (homeDevice.deviceType === DeviceType.PILOT) {
      await this._handlePilotActions(deviceProfile);
    }
  }

  private _shouldIgnoreSensor(zigbeeDeviceId: string): boolean {
    if (this._ignoredDevices.has(zigbeeDeviceId)) {
      this._logger.log(`Ignoring sensor event from ${zigbeeDeviceId} (marked as open when arming).`);
      return true;
    }
    return false;
  }

  private _isOpenDoorTriggered(sensor: HomeDevice, response: DeviceProfile, isAlarmActive: boolean): boolean {
    return sensor.deviceType === DeviceType.OPEN_DOOR_SENSOR && !response.state['contact'] && isAlarmActive;
  }

  private async _triggerAlarm(sensor: HomeDevice): Promise<void> {
    if (!this._sirenIsActive) {
      this._logger.log('House has been opened! Notify users!');
      await this._setSirensMode(true);
      await this._pushNotificationService.notify({
        title: 'Alarm!',
        body: `Otwarto: ${sensor.deviceName}`,
      });
    }
  }

  private async _updateIgnoredDevices(): Promise<void> {
    const openSensors: DeviceProfile[] = Array.from(this._zigbeeDeviceService.devices)
      .filter(([, deviceProfile]) => deviceProfile.state['contact'] === false)
      .map(([, deviceProfile]) => deviceProfile);

    this._ignoredDevices = new Set(openSensors.map((sensor) => sensor.deviceIdentity.friendlyName));
    this._logger.log(`Ignored devices on alarm activation: ${Array.from(this._ignoredDevices).join(', ')}`);
  }

  private async _handlePilotActions(deviceProfile: DeviceProfile): Promise<void> {
    switch (deviceProfile.state['action']) {
      case 'arm_all_zones':
      case 'arm_day_zones':
        await this.setAlarmMode(true);
        break;
      case 'disarm':
        await this.setAlarmMode(false);
        break;
      case 'panic':
        await this._setSirensMode(true);
        break;
      default:
        this._logger.log('Unsupported action: ', deviceProfile.state['action']);
    }
  }

  private async _setSirensMode(isOn: boolean): Promise<void> {
    const sirens: HomeDevice[] = await this._homeDeviceRepository.findBy({ deviceType: DeviceType.SIREN });

    sirens.forEach((siren) => {
      this._zigbeeDeviceService.publishEvent(
        siren.zigbeeDeviceId,
        JSON.stringify({
          warning: {
            duration: isOn ? AlarmService._SIREN_DURATION : 0,
            mode: isOn ? 'burglar' : 'stop',
            level: 'very_high',
          },
        })
      );
    });

    this._sirenIsActive = isOn;
  }
}
