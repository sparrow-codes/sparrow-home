import { DeviceType, HomeDevice } from '@sparrow-home/utils';

export interface HomeDeviceState {
  _devicePaired: boolean | null;

  deviceTypeFilter: DeviceType | null;
  deviceDetails: HomeDevice | null;
  searchQuery: string;
  noDevices: boolean | null;
}
