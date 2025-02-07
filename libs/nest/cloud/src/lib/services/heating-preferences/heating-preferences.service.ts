import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudPreferences, HomeDevice, User, UserRole } from '@sparrow-server/entities';
import { Repository } from 'typeorm';

import { GetHeatingPreferencesResponse } from '../../controllers/models/heating-preferences/get-heating-preferences.response';
import { SetHeatingPreferencesRequest } from '../../controllers/models/heating-preferences/set-heating-preferences.request';

@Injectable()
export class HeatingPreferencesService {
  public constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    @InjectRepository(CloudPreferences) private readonly _cloudPreferencesRepository: Repository<CloudPreferences>,
    @InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>
  ) {}

  public async setAutomaticHeating(isAutomaticHeating: boolean): Promise<void> {
    const user: User = await this._getUser();
    const preferences: CloudPreferences = user.cloudPreferences;

    preferences.isAutomaticHeat = isAutomaticHeating;
    await this._cloudPreferencesRepository.save(preferences);
  }

  public async setHeatingPreferences(request: SetHeatingPreferencesRequest): Promise<void> {
    const user: User = await this._getUser();
    const preferences: CloudPreferences = user.cloudPreferences;

    const groundFlorSensor: HomeDevice | null = await this._homeDeviceRepository.findOneBy({
      id: request.groundFlorSensorId,
    });

    const firstFlorSensor: HomeDevice | null = await this._homeDeviceRepository.findOneBy({
      id: request.groundFlorSensorId,
    });

    preferences.groundFlorTemperatureSensorZigbeeId = groundFlorSensor?.zigbeeDeviceId ?? null;
    preferences.firstFlorTemperatureSensorZigbeeId = firstFlorSensor?.zigbeeDeviceId ?? null;
    preferences.minTargetTemperature = request.minTargetTemperature ?? null;
    preferences.maxTargetTemperature = request.maxTargetTemperature ?? null;

    await this._cloudPreferencesRepository.save(preferences);
  }

  public async getHeatingPreferences(): Promise<GetHeatingPreferencesResponse> {
    const user: User = await this._getUser();

    const firstFlorSensor: HomeDevice | null = await this._homeDeviceRepository.findOneBy({
      zigbeeDeviceId: user.cloudPreferences.firstFlorTemperatureSensorZigbeeId ?? undefined,
    });

    const groundFlorSensor: HomeDevice | null = await this._homeDeviceRepository.findOneBy({
      zigbeeDeviceId: user.cloudPreferences.groundFlorTemperatureSensorZigbeeId ?? undefined,
    });

    return {
      isAutomaticHeat: user.cloudPreferences.isAutomaticHeat,
      groundFlorTemperatureSensorId: groundFlorSensor?.id,
      firstFlorTemperatureSensorId: firstFlorSensor?.id,
      maxTargetTemperature: user.cloudPreferences.maxTargetTemperature ?? undefined,
      minTargetTemperature: user.cloudPreferences.minTargetTemperature ?? undefined,
    };
  }

  private async _getUser(): Promise<User> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
