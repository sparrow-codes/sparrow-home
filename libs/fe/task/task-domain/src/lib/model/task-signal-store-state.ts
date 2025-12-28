import { AvailableDevice } from './available-device';

export interface TaskSignalStoreState {
  availableDevices: AvailableDevice[];
  noSchedules: boolean | null;
}
