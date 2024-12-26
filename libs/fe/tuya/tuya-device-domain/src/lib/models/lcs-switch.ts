import { TuyaDevice } from './tuya-device';

export interface LcsSwitch extends TuyaDevice {
  isOn: boolean;
}
