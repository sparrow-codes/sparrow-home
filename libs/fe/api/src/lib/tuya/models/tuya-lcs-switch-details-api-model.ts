import { TuyaDeviceDetailsApiModel } from './';

export interface TuyaLcsSwitchDetailsApiModel extends TuyaDeviceDetailsApiModel {
  isOn: boolean;
}
