import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmPreferences, DeviceType, HomeDevice, User, UserRole } from '@sparrow-server/entities';
import {
  DeviceResponse,
  OpenDoorSensorDetails,
  PilotDetails,
  SensorDetails,
  ZigbeeSensorService,
  ZigbeeSirenService,
} from '@sparrow-server/external-api';
import { PushNotificationService } from '@sparrow-server/push';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class AlarmService {
  private _isSirensWorking: boolean = false;
  private _ignoredDevices: Set<string> = new Set();

  public constructor(
    private readonly _zigbeeSirenService: ZigbeeSirenService,
    private readonly _zigbeeSensorService: ZigbeeSensorService,
    private readonly _pushNotificationService: PushNotificationService,
    @InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>,
    @InjectRepository(AlarmPreferences) private readonly _alarmPreferencesRepository: Repository<AlarmPreferences>,
    @InjectRepository(User) private readonly _userRepository: Repository<User>
  ) {
    this._zigbeeSensorService.sensorDetails$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current))
      )
      .subscribe((response) => this._handleSensorEvent(response));
  }

  public async setAlarmMode(isActive: boolean): Promise<void> {
    const user: User = await this._getUser();
    const alarmPreferences: AlarmPreferences = user.alarmPreferences;

    alarmPreferences.isActive = isActive;
    await this._alarmPreferencesRepository.save(alarmPreferences);
    Logger.log(isActive ? 'Alarm is on!' : 'Alarm is off!');

    if (isActive) {
      await this._updateIgnoredDevices();
    } else {
      await this._setSirensMode(false);
      this._ignoredDevices.clear();
    }
  }

  public async getAlarmMode(): Promise<boolean> {
    const user: User = await this._getUser();
    const alarmPreferences: AlarmPreferences = user.alarmPreferences;

    return alarmPreferences.isActive;
  }

  public getSirensStatus(): boolean {
    return this._isSirensWorking;
  }

  private async _handleSensorEvent(response: DeviceResponse<SensorDetails>): Promise<void> {
    const sensor: HomeDevice | null = await this._findSensor(response.deviceId);
    if (!sensor) return;

    if (this._shouldIgnoreSensor(sensor)) return;

    const isAlarmActive: boolean = await this.getAlarmMode();

    if (this._isOpenDoorTriggered(sensor, response, isAlarmActive)) {
      await this._triggerAlarm(sensor);
    } else if (sensor.deviceType === DeviceType.PILOT) {
      await this._handlePilotActions(response.payload as PilotDetails);
    }
  }

  private async _findSensor(deviceId: string): Promise<HomeDevice | null> {
    return this._homeDeviceRepository.findOneBy({ zigbeeDeviceId: deviceId });
  }

  private _shouldIgnoreSensor(sensor: HomeDevice): boolean {
    if (this._ignoredDevices.has(sensor.zigbeeDeviceId)) {
      Logger.log(`Ignoring sensor event from ${sensor.deviceName} (marked as open when arming).`);
      return true;
    }
    return false;
  }

  private _isOpenDoorTriggered(
    sensor: HomeDevice,
    response: DeviceResponse<SensorDetails>,
    isAlarmActive: boolean
  ): boolean {
    return (
      sensor.deviceType === DeviceType.OPEN_DOOR_SENSOR &&
      !(response.payload as OpenDoorSensorDetails).contact &&
      isAlarmActive
    );
  }

  private async _triggerAlarm(sensor: HomeDevice): Promise<void> {
    Logger.log('House has been opened! Notify users!');
    await this._setSirensMode(true);
    await this._pushNotificationService.notify({
      title: 'Alarm!',
      body: `Otwarto: ${sensor.deviceName}`,
    });
  }

  private async _updateIgnoredDevices(): Promise<void> {
    const openSensors: HomeDevice[] = await this._homeDeviceRepository.findBy({
      deviceType: DeviceType.OPEN_DOOR_SENSOR,
      isOpen: true,
    });

    this._ignoredDevices = new Set(openSensors.map((sensor) => sensor.zigbeeDeviceId));
    Logger.log(`Ignored devices on alarm activation: ${Array.from(this._ignoredDevices).join(', ')}`);
  }

  private async _getUser(): Promise<User> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user;
  }

  private async _handlePilotActions(pilotDetails: PilotDetails): Promise<void> {
    switch (pilotDetails.action) {
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
        Logger.log('Unsupported action: ', pilotDetails.action);
    }
  }

  private async _setSirensMode(isOn: boolean): Promise<void> {
    const sirens: HomeDevice[] = await this._homeDeviceRepository.findBy({ deviceType: DeviceType.SIREN });

    if (sirens.length < 1) {
      Logger.log('No sirens found connected to your home!');
      return;
    }

    sirens.forEach((siren) => {
      this._zigbeeSirenService.setAlarm(siren.zigbeeDeviceId, isOn);
    });
    this._isSirensWorking = isOn;
  }
}
