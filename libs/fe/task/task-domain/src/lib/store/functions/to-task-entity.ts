import { TaskDtoApiModel } from '@sparrow-home/api';

import { AutomaticTask } from '../../model/';

export function toTaskEntity(model: TaskDtoApiModel): AutomaticTask {
  return {
    id: model.id as number,
    startTime: new Date(model.startTime),
    endTime: new Date(model.endTime),
    isActive: model.isActive,
    name: model.name,
    homeDevices: model.assignedDevices,
  };
}
