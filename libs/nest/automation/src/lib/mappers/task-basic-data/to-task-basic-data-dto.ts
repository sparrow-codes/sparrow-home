import { Task } from '@sparrow-server/entities';
import { TaskDto } from '../../controller/task/model/task-dto';

export function toTaskBasicDataDto(task: Task): Omit<TaskDto, 'actions'> {
  return {
    id: task.id,
    name: task.name ?? '',
    isActive: task.isActive,
    daysOfWeek: task.daysOfWeek?.length ? task.daysOfWeek : null,
  };
}
