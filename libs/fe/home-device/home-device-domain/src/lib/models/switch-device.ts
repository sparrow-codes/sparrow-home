import { HomeDevice } from './home-device';

export interface SwitchDevice extends HomeDevice {
  isOn: boolean;
}
