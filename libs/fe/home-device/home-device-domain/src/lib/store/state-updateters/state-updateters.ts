import { DeviceType, HomeDevice } from '@sparrow-home/utils';

import { HomeDeviceState } from '../model/home-device-state';

export function withDeviceType(deviceType?: DeviceType): Pick<HomeDeviceState, 'deviceTypeFilter'> {
  return { deviceTypeFilter: deviceType ?? null };
}

export function withSearchQuery(query: string): Pick<HomeDeviceState, 'searchQuery'> {
  return { searchQuery: query };
}

export function withNoDevices(): Pick<HomeDeviceState, 'noDevices'> {
  return { noDevices: true };
}

export function withDevices(): Pick<HomeDeviceState, 'noDevices'> {
  return { noDevices: false };
}

export function withDevicePaired(paired: boolean | null): Pick<HomeDeviceState, 'devicePaired'> {
  return { devicePaired: paired };
}

export function withDeviceDetails(deviceDetails: HomeDevice | null): Pick<HomeDeviceState, 'deviceDetails'> {
  return { deviceDetails };
}
