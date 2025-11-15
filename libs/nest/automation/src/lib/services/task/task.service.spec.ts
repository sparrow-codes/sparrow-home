import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HomeDevice, Task } from '@sparrow-server/entities';
import { Repository } from 'typeorm';
import { TaskCronFactory } from '../test-cron-factory/task-cron-factory.service';
import { NotFoundException } from '@nestjs/common';
import { TaskDtoMapperService } from '../task-dto-mapper.service';

describe('TaskService', () => {
  let service: TaskService;
  let repository: jest.Mocked<Repository<Task>>;
  let cronFactory: jest.Mocked<TaskCronFactory>;
  let mockedMapper: jest.Mocked<TaskDtoMapperService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            save: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(() => []),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(HomeDevice),
          useValue: {
            findBy: jest.fn(),
          },
        },
        {
          provide: TaskCronFactory,
          useValue: {
            scheduleTask: jest.fn(),
            clearScheduledTask: jest.fn(),
          },
        },
        {
          provide: TaskDtoMapperService,
          useValue: {
            map: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get(getRepositoryToken(Task));
    cronFactory = module.get(TaskCronFactory);
    mockedMapper = module.get(TaskDtoMapperService);
  });

  it('should create a task and save it', async () => {
    await service.createTask({ actions: [], name: 'test' });
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ name: 'test', isActive: false }));
  });

  it('should throw if task not found when updating', async () => {
    repository.findOneBy.mockResolvedValue(null);
    await expect(service.updateTask(1, { actions: [], name: 'update' })).rejects.toThrow(NotFoundException);
  });

  it('should update task and reset active', async () => {
    repository.findOneBy.mockResolvedValue({ id: 1 } as Task);
    await service.updateTask(1, {
      actions: [],
      name: 'update',
    });
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ name: 'update' }));
  });

  it('should delete task and clear its schedule', async () => {
    await service.deleteTask(123);
    expect(cronFactory.clearScheduledTask).toHaveBeenCalledWith(123);
    expect(repository.delete).toHaveBeenCalledWith({ id: 123 });
  });

  it('should activate task if status is set to true', async () => {
    repository.findOneBy.mockResolvedValue({ id: 1, name: 't', homeDevices: [] } as any);
    await service.updateTaskStatus(1, true);
    expect(cronFactory.scheduleTask).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ isActive: true }));
  });

  it('should deactivate task and stop cron if status is false', async () => {
    repository.findOneBy.mockResolvedValue({ id: 1, name: 't' } as any);
    await service.updateTaskStatus(1, false);
    expect(cronFactory.clearScheduledTask).toHaveBeenCalledWith(1);
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ isActive: false }));
  });

  it('should run _onInit and activate active tasks', async () => {
    const spy = jest.spyOn(service, 'activateTask');
    repository.find.mockResolvedValue([{ id: 1, isActive: true, name: 'A' }] as any);
    await (service as any)._onInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should return list of tasks from repository', async () => {
    const tasks: Task[] = [
      { id: 2, name: 'Task B', isActive: true } as Task,
      { id: 1, name: 'Task A', isActive: false } as Task,
      { id: 3, name: 'Task A', isActive: false } as Task,
    ];
    repository.find.mockResolvedValue(tasks);
    mockedMapper.map.mockImplementation((task: Task) => ({ ...task } as never));

    const result = await service.getTaskList();
    expect(result).toEqual(tasks);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
    expect(result[2].id).toBe(3);
    expect(repository.find).toHaveBeenCalled();
    expect(mockedMapper.map).toHaveBeenCalledTimes(3);
  });
});
