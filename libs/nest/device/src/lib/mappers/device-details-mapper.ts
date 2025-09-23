import { DeviceType, HomeDevice } from '@sparrow-server/entities';
import { DeviceResponse, IkeaSwitchStatusResponse } from '@sparrow-server/external-api';

import { OpenDoorSensorDetailsDto } from '../models/open-door-sensor-details-dto';
import { PetFeederDetailsDto } from '../models/pet-feeder-details-dto';
import { PilotDetailsDto } from '../models/pilot-details.dto';
import { PluginSwitchDetailsDto } from '../models/plugin-switch-details.dto';
import { SirenDetailsDto } from '../models/siren-details-dto';
import { TemperatureSensorDetailsDto } from '../models/temperature-sensor-details-dto';
import { calculatePercentage } from '../utils/calculate-percentage';

export class DeviceDetailsMapper {
  public static getSwitchDetails(
    entity: HomeDevice,
    response: DeviceResponse<IkeaSwitchStatusResponse> | null
  ): PluginSwitchDetailsDto {
    return {
      ...this._withBasicData(entity),
      isOnline: !!response && response.payload.linkquality > 0,
      isOn: !!response && response?.payload.state === 'ON',
      signalStrength: this._toSignalStrength(response?.payload.linkquality ?? null),
    };
  }

  public static getTemperatureSensorDetails(entity: HomeDevice): TemperatureSensorDetailsDto {
    return {
      ...this._withBasicData(entity),
      temperature: entity.temperature != null ? entity.temperature : undefined,
      signalStrength: this._toSignalStrength(entity.signalStrength),
      isOnline: this._setOnlineStatusBySignalStrength(entity.signalStrength),
      battery: entity.battery !== null ? entity.battery : undefined,
    };
  }

  public static getOpenDoorSensorDetails(entity: HomeDevice): OpenDoorSensorDetailsDto {
    return {
      ...this._withBasicData(entity),
      signalStrength: this._toSignalStrength(entity.signalStrength),
      isOnline: this._setOnlineStatusBySignalStrength(entity.signalStrength),
      battery: entity.battery !== null ? entity.battery : undefined,
      isOpen: entity.isOpen !== null ? entity.isOpen : undefined,
      lastOpened: entity.lastOpened,
    };
  }

  public static getSirenDetailsDto(entity: HomeDevice): SirenDetailsDto {
    return {
      ...this._withBasicData(entity),
      signalStrength: this._toSignalStrength(entity.signalStrength),
      isOnline: this._setOnlineStatusBySignalStrength(entity.signalStrength),
      battery: entity.battery !== null ? entity.battery : undefined,
    };
  }

  public static getPilotDetailDto(entity: HomeDevice): PilotDetailsDto {
    return {
      ...this._withBasicData(entity),
      signalStrength: this._toSignalStrength(entity.signalStrength),
      isOnline: this._setOnlineStatusBySignalStrength(entity.signalStrength),
      battery: entity.battery !== null ? entity.battery : undefined,
    };
  }

  public static toPetFeederDetailsDto(entity: HomeDevice): PetFeederDetailsDto {
    return {
      ...this._withBasicData(entity),
      signalStrength: this._toSignalStrength(entity.signalStrength),
      isOnline: this._setOnlineStatusBySignalStrength(entity.signalStrength),
      numberOfPortions: entity.feederNumberOfPortions,
      portionSize: entity.feederPortionSize,
    };
  }

  private static _withBasicData(entity: HomeDevice): {
    id: number;
    type: DeviceType;
    homeDeviceId: string;
    name: string;
  } {
    return {
      id: entity.id,
      type: entity.deviceType,
      homeDeviceId: entity.zigbeeDeviceId,
      name: entity.deviceName,
    };
  }

  private static _setOnlineStatusBySignalStrength(signalStrength: number | null): boolean {
    return !!signalStrength && signalStrength > 0;
  }

  private static _toSignalStrength(signalStrength: number | null): number {
    return signalStrength ? calculatePercentage(0, 255, signalStrength) : 0;
  }
}
