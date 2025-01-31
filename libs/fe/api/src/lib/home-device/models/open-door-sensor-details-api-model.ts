import { HomeDeviceDetailsApiModel } from '.';

export interface OpenDoorSensorDetailsApiModel extends HomeDeviceDetailsApiModel {
  battery?: number;
  isOpen?: boolean;
}
