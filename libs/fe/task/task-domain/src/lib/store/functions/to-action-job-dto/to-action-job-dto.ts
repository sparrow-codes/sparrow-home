import { ActionJobDtoApiModel } from '@sparrow-home/api';

import { TaskAction } from '../../../model';

export function toActionJobDto(taskAction: TaskAction): ActionJobDtoApiModel {
  return {
    assignedDeviceId: taskAction.zigbeeDeviceId,
    executionTime: taskAction.executionTime.toISOString(),
    daysOfTheWeek: taskAction.daysOfWeek,
    payload: { [taskAction.action.key]: taskAction.action.currentValue },
  };
}
