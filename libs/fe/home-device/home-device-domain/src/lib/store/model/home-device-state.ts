import { DeviceType, HomeDevice } from '@sparrow-home/utils';

export interface HomeDeviceState {
  deviceTypeFilter: DeviceType | null;
  deviceDetails: HomeDevice | null;
  searchQuery: string;
  noDevices: boolean | null;
  devicePaired: boolean | null;
}
