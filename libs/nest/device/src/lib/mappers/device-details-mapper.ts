import { DeviceType, HomeDevice } from '@sparrow-server/entities';
import { DeviceResponse, IkeaSwitchStatusResponse } from '@sparrow-server/external-api';

import { OpenDoorSensorDetailsDto } from '../models/open-door-sensor-details-dto';
import { PluginSwitchDetailsDto } from '../models/plugin-switch-details.dto';
import { TemperatureSensorDetailsDto } from '../models/temperature-sensor-details-dto';
import { calculatePercentage } from '../utils/calculate-percentage';

export class DeviceDetailsMapper {
  public static getSwitchDetails(
    entity: HomeDevice,
    response: DeviceResponse<IkeaSwitchStatusResponse> | null
  ): PluginSwitchDetailsDto {
    return {
      type: DeviceType.POWER_PLUG,
      name: entity.deviceName,
      homeDeviceId: entity.zigbeeDeviceId,
      id: entity.id,
      isOnline: !!response && response.payload.linkquality > 0,
      isOn: !!response && response?.payload.state === 'ON',
      signalStrength: response ? calculatePercentage(0, 255, response.payload.linkquality) : 0,
    };
  }

  public static getTemperatureSensorDetails(entity: HomeDevice): TemperatureSensorDetailsDto {
    return {
      type: entity.deviceType,
      homeDeviceId: entity.zigbeeDeviceId,
      name: entity.deviceName,
      temperature: entity.temperature != null ? entity.temperature : undefined,
      signalStrength: entity.signalStrength ? calculatePercentage(0, 255, entity.signalStrength) : 0,
      isOnline: !!entity.signalStrength && entity.signalStrength > 0,
      battery: entity.battery !== null ? entity.battery : undefined,
      id: entity.id,
    };
  }

  public static getOpenDoorSensorDetails(entity: HomeDevice): OpenDoorSensorDetailsDto {
    return {
      type: entity.deviceType,
      homeDeviceId: entity.zigbeeDeviceId,
      name: entity.deviceName,
      signalStrength: entity.signalStrength ? calculatePercentage(0, 255, entity.signalStrength) : 0,
      isOnline: !!entity.signalStrength && entity.signalStrength > 0,
      battery: entity.battery !== null ? entity.battery : undefined,
      isOpen: entity.isOpen !== null ? entity.isOpen : undefined,
      id: entity.id,
    };
  }
}
