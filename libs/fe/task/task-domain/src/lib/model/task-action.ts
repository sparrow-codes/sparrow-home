import { DeviceAction } from '@sparrow-home/utils';

export interface TaskAction {
  zigbeeDeviceId: string;
  deviceName: string;
  deviceDescription: string;
  executionTime: Date;
  daysOfWeek: number[] | null;
  action: DeviceAction;
}
