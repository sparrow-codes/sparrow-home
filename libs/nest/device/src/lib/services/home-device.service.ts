import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AquaPreferences, CloudPreferences, DeviceType, HomeDevice, User, UserRole } from '@sparrow-server/entities';
import { ZigbeeManageDeviceService, ZigbeeSwitchMqttService } from '@sparrow-server/external-api';
import { CronJobName } from '@sparrow-server/shared';
import { combineLatest, first, from, map, Observable, of, switchMap } from 'rxjs';
import { Repository } from 'typeorm';

import { HomeDeviceDto } from '../models/home-device-dto';
import { PluginSwitchDetailsDto } from '../models/plugin-switch-details.dto';
import { calculatePercentage } from '../utils/calculate-percentage';

@Injectable()
export class HomeDeviceService {
  public constructor(
    @InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>,
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    @InjectRepository(AquaPreferences) private readonly _aquaPreferencesRepository: Repository<AquaPreferences>,
    @InjectRepository(CloudPreferences) private readonly _cloudPreferencesRepository: Repository<CloudPreferences>,
    private readonly _zigbeeSwitchMqttService: ZigbeeSwitchMqttService,
    private readonly _zigbeeManageDeviceService: ZigbeeManageDeviceService,
    private readonly scheduledRegistry: SchedulerRegistry
  ) {}

  public async getListOfDevices(): Promise<HomeDeviceDto[]> {
    const devices: HomeDevice[] = await this._homeDeviceRepository.find();
    return devices.map(this._toDeviceDto);
  }

  public async addDevice(type: DeviceType, zigbeeDeviceId: string, name: string): Promise<void> {
    if (await this._homeDeviceRepository.findOneBy({ zigbeeDeviceId: zigbeeDeviceId })) {
      throw new ForbiddenException('Home Device already exists!');
    }

    const device: HomeDevice = new HomeDevice();
    device.deviceType = type;
    device.zigbeeDeviceId = zigbeeDeviceId;
    device.deviceName = name;
    await this._homeDeviceRepository.save(device);
  }

  public async removeDevice(id: number): Promise<void> {
    const homDevice: HomeDevice | null = await this._homeDeviceRepository.findOneBy({ id });

    if (!homDevice) {
      return;
    }

    const user: User = await this._getUser();
    const aquaPreferences: AquaPreferences = user.aquaPreferences;
    const cloudPreferences: CloudPreferences = user.cloudPreferences;

    if (aquaPreferences.homeDevice?.id === homDevice.id) {
      aquaPreferences.homeDevice = null;
      aquaPreferences.isActive = false;
      await this._aquaPreferencesRepository.save(aquaPreferences);
      this.scheduledRegistry.getCronJob(CronJobName.EVERY_DAY_AQUA_LIGHT).stop();
    }

    if (cloudPreferences.homeDevice?.id === homDevice.id) {
      cloudPreferences.homeDevice = null;
      cloudPreferences.isCircularPumpActive = false;
      await this._cloudPreferencesRepository.save(cloudPreferences);
      this.scheduledRegistry.getCronJob(CronJobName.EVERY_DAY_AQUA_LIGHT).stop();
    }

    await this._zigbeeManageDeviceService.removeDevice(homDevice.zigbeeDeviceId);
    await this._homeDeviceRepository.delete({ id });
  }

  public getDeviceDetails(id: number): Observable<PluginSwitchDetailsDto> {
    return from(this._homeDeviceRepository.findOneBy({ id })).pipe(
      first(),
      switchMap((entity) => {
        if (!entity) {
          throw new NotFoundException(`Home Device not found for id: ${id}`);
        }

        return combineLatest([of(entity), this._zigbeeSwitchMqttService.getSwitchStatus(entity.zigbeeDeviceId)]);
      }),
      map(([entity, response]) => ({
        type: DeviceType.POWER_PLUG,
        name: entity.deviceName,
        homeDeviceId: entity.zigbeeDeviceId,
        id: entity.id,
        isOnline: !!(response && response.payload.linkquality > 0),
        isOn: !!(response && response?.payload.state === 'ON'),
        signalStrength: response ? calculatePercentage(0, 255, response.payload.linkquality) : 0,
      }))
    );
  }

  public setPluginSwitchStatus(id: number, isOn: boolean): Observable<boolean> {
    return from(this._homeDeviceRepository.findOneBy({ id })).pipe(
      first(),
      switchMap((entity) => {
        if (!entity) {
          throw new NotFoundException(`Home Device not found for id: ${id}`);
        }

        return this._zigbeeSwitchMqttService.setSwitchOn(entity.zigbeeDeviceId, isOn);
      })
    );
  }

  public enableParingMode(): Observable<void> {
    return from(this._zigbeeManageDeviceService.allowDeviceJoin());
  }

  private _toDeviceDto(device: HomeDevice): HomeDeviceDto {
    return {
      id: device.id,
      name: device.deviceName,
      type: device.deviceType,
      homeDeviceId: device.zigbeeDeviceId,
    };
  }

  private async _getUser(): Promise<User> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }

    return user;
  }
}
