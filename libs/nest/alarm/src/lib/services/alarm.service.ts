import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmPreferences, DeviceType, HomeDevice, User, UserRole } from '@sparrow-server/entities';
import {
  DeviceResponse,
  OpenDoorSensorDetails,
  SensorDetails,
  ZigbeeSensorService,
  ZigbeeSirenService,
} from '@sparrow-server/external-api';
import { PushNotificationService } from '@sparrow-server/push';
import { Repository } from 'typeorm';

@Injectable()
export class AlarmService {
  public constructor(
    private readonly _zigbeeSirenService: ZigbeeSirenService,
    private readonly _zigbeeSensorService: ZigbeeSensorService,
    private readonly _pushNotificationService: PushNotificationService,
    @InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>,
    @InjectRepository(AlarmPreferences) private readonly _alarmPreferencesRepository: Repository<AlarmPreferences>,
    @InjectRepository(User) private readonly _userRepository: Repository<User>
  ) {
    this._zigbeeSensorService.sensorDetails$.pipe().subscribe((response) => this._handleSensorEvent(response));
  }

  public async setAlarm(isOn: boolean): Promise<void> {
    const sirens: HomeDevice[] = await this._homeDeviceRepository.findBy({ deviceType: DeviceType.SIREN });

    if (sirens.length < 1) {
      Logger.log('No sirens found connected to your home!');
      return;
    }

    sirens.forEach((siren) => {
      this._zigbeeSirenService.setAlarm(siren.zigbeeDeviceId, isOn);
    });
  }

  public async setAlarmMode(isActive: boolean): Promise<void> {
    const user: User = await this._getUser();
    const alarmPreferences: AlarmPreferences = user.alarmPreferences;

    alarmPreferences.isActive = isActive;
    await this._alarmPreferencesRepository.save(alarmPreferences);
  }

  public async getAlarmMode(): Promise<boolean> {
    const user: User = await this._getUser();
    const alarmPreferences: AlarmPreferences = user.alarmPreferences;

    return alarmPreferences.isActive;
  }

  private async _handleSensorEvent(response: DeviceResponse<SensorDetails>): Promise<void> {
    const sensor: HomeDevice | null = await this._homeDeviceRepository.findOneBy({ zigbeeDeviceId: response.deviceId });
    const user: User = await this._getUser();
    const alarmPreferences: AlarmPreferences = user.alarmPreferences;

    if (!sensor) {
      return;
    }

    if (
      sensor.deviceType === DeviceType.OPEN_DOOR_SENSOR &&
      !(response.payload as OpenDoorSensorDetails).contact &&
      alarmPreferences
    ) {
      this._pushNotificationService.notify({
        title: 'Alarm!',
        body: `Otwarto: ${sensor.deviceName}`,
      });
    }
  }

  private async _getUser(): Promise<User> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user;
  }
}
