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
    });
  });

  it('should ', () => {});

  function prepareTask(): Task {
    return {
      actionJobs: [],
      id: 0,
      isActive: false,
      name: 'Task name',
    };
  }
});
