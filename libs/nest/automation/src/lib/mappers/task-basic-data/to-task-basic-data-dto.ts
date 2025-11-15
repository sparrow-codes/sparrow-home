import { Task } from '@sparrow-server/entities';
import { TaskDto } from '../../controller/task/model/task-dto';

export function toTaskBasicDataDto(task: Task): Pick<TaskDto, 'name' | 'id' | 'isActive'> {
  return {
    id: task.id,
    name: task.name ?? '',
    isActive: task.isActive,
  };
}
