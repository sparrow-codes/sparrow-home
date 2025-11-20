import { toTaskBasicDataDto } from './to-task-basic-data-dto';
import { Task } from '@sparrow-server/entities';

describe('toTaskBasicDataDto', () => {
  it('should map basic data', () => {
    const task: Task = prepareTask();
    const dto = toTaskBasicDataDto(task);
    expect(dto).toEqual({
      id: task.id,
      name: task.name,
      isActive: task.isActive,
      daysOfWeek: [1, 2, 3, 4],
    });
  });

  it('should map null days of week', () => {
    const task: Task = prepareTask();
    task.daysOfWeek = null;
    const dto = toTaskBasicDataDto(task);
    expect(dto).toEqual({
      id: task.id,
      name: task.name,
      isActive: task.isActive,
      daysOfWeek: null,
    });
  });

  it('should map empty days of week', () => {
    const task: Task = prepareTask();
    task.daysOfWeek = [];
    const dto = toTaskBasicDataDto(task);
    expect(dto).toEqual({
      id: task.id,
      name: task.name,
      isActive: task.isActive,
      daysOfWeek: null,
    });
  });

  function prepareTask(): Task {
    return {
      daysOfWeek: [1, 2, 3, 4],
      actionJobs: [],
      id: 0,
      isActive: false,
      name: 'Task name',
    };
  }
});
