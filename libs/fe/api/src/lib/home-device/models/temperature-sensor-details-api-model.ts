import { HomeDeviceDetailsApiModel } from '.';

export interface TemperatureSensorDetailsApiModel extends HomeDeviceDetailsApiModel {
  battery?: number;
  temperature?: number;
  humidity?: number;
}
