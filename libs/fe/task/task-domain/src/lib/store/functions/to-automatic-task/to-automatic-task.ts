import { TaskDtoApiModel } from '@sparrow-home/api';

import { AutomaticTask } from '../../../model';
import { toTaskAction } from '../to-task-action/to-task-action';

export function toAutomaticTask(model: TaskDtoApiModel): AutomaticTask {
  return {
    id: model.id as number,
    isActive: model.isActive,
    name: model.name,
    actions: model.actions.map(toTaskAction),
    daysOfWeek: model.daysOfWeek,
  };
}
