import { Commands } from './commands';

export interface TuyaDeviceDetailsCloudModel {
  online: boolean;
  commands?: Commands<unknown>[];
}
