import { Task } from '@sparrow-server/entities';
import { TaskDto } from '../model/task-dto';

export function toTaskDto(task: Task): TaskDto {
  return {
    id: task.id,
    name: task.name ?? '',
    endTime: task.endTime,
    startTime: task.startTime,
    isActive: task.isActive,
    atSunset: task.atSunset,
    assignedDevices: task.homeDevices?.map((device) => device.id) ?? [],
  };
}
