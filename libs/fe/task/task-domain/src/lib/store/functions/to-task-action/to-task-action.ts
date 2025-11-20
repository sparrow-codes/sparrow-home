import { TaskActionDtoApiModel } from '@sparrow-home/api';
import { toDeviceAction } from '@sparrow-home/utils';

import { TaskAction } from '../../../model/task-action';

export function toTaskAction(action: TaskActionDtoApiModel): TaskAction {
  return {
    executionTime: new Date(action.executionTime),
    zigbeeDeviceId: action.zigbeeDeviceId,
    deviceDescription: action.deviceDescription,
    deviceName: action.deviceName,
    action: toDeviceAction(action.action),
    daysOfWeek: action.daysOfTheWeek,
  };
}
