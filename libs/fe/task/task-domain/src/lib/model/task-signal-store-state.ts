import { AutomaticTask } from './automatic-task';
import { AvailableDevice } from './available-device';

export interface TaskSignalStoreState {
  availableDevices: AvailableDevice[];
  taskDetails: AutomaticTask | null;
  noSchedules: boolean | null;
}
