import { ActionJobDtoApiModel } from '@sparrow-home/api';

import { TaskAction } from '../../../model';

export function toActionJobDto(taskAction: TaskAction): ActionJobDtoApiModel {
  return {
    assignedDeviceId: taskAction.zigbeeDeviceId,
    executionTime: taskAction.executionTime.toISOString(),
    payload: JSON.stringify({ [taskAction.action.key]: taskAction.action.currentValue }),
  };
}
