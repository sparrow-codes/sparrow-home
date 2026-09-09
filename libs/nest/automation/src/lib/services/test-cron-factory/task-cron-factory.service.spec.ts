import { Test, TestingModule } from '@nestjs/testing';
import { TaskCronFactory } from './task-cron-factory.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ZigbeeDeviceService } from '@sparrow-server/external-api';
import { Setup, Task } from '@sparrow-server/entities';
import { CronJob } from 'cron';
import { getRepositoryToken } from '@nestjs/typeorm';

jest.mock('cron', () => {
  return {
    CronJob: jest.fn().mockImplementation((_, cb) => ({ start: jest.fn(), callback: cb, nextDate: jest.fn() })),
  };
});

describe('TaskCronFactory', () => {
  let factory: TaskCronFactory;
  let schedulerRegistry: jest.Mocked<SchedulerRegistry>;
  let zigbeeService: jest.Mocked<ZigbeeDeviceService>;
  let setupRepository: { find: jest.Mock };

  beforeEach(async () => {
    (CronJob as unknown as jest.Mock).mockClear();

    schedulerRegistry = {
      addCronJob: jest.fn(),
      deleteCronJob: jest.fn(),
      doesExist: jest.fn().mockReturnValue(true),
    } as any;

    zigbeeService = {
      publishEvent: jest.fn(),
    } as any;

    setupRepository = {
      find: jest.fn().mockResolvedValue([{ isVacationMode: false }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskCronFactory,
        { provide: SchedulerRegistry, useValue: schedulerRegistry },
        { provide: ZigbeeDeviceService, useValue: zigbeeService },
        { provide: getRepositoryToken(Setup), useValue: setupRepository },
      ],
    }).compile();

    factory = module.get(TaskCronFactory);
  });

  it('should clear scheduled jobs', () => {
    factory.clearScheduledTask(1);
    expect(schedulerRegistry.deleteCronJob).toHaveBeenCalledTimes(1);
  });

  it('should schedule valid task and create jobs', () => {
    const task: Task = prepareTask();

    factory.scheduleTask(task);
    expect(schedulerRegistry.addCronJob).toHaveBeenCalledTimes(1);
  });

  it('should not schedule tasks for empty actions', () => {
    const task: Task = prepareTask();
    task.actionJobs = undefined as never;

    factory.scheduleTask(task);
    expect(schedulerRegistry.addCronJob).toHaveBeenCalledTimes(0);
  });

  it('should activate power plug device when vacation mode is inactive', async () => {
    const task: Task = prepareTask();

    factory.scheduleTask(task);
    const job = (CronJob as unknown as jest.Mock).mock.calls[0][1];
    await job();
    expect(zigbeeService.publishEvent).toHaveBeenCalledWith(
      task.actionJobs[0].assignedDeviceId,
      JSON.stringify(task.actionJobs[0].payload)
    );
  });

  it('should skip jobs during vacation mode when runOnVacation is false', async () => {
    setupRepository.find.mockResolvedValue([{ isVacationMode: true }]);
    const task: Task = prepareTask();
    task.actionJobs[0].runOnVacation = false;

    factory.scheduleTask(task);
    const job = (CronJob as unknown as jest.Mock).mock.calls[0][1];
    await job();

    expect(zigbeeService.publishEvent).not.toHaveBeenCalled();
  });

  it('should activate power plug device during vacation mode when runOnVacation is true', async () => {
    setupRepository.find.mockResolvedValue([{ isVacationMode: true }]);
    const task: Task = prepareTask();

    factory.scheduleTask(task);
    const job = (CronJob as unknown as jest.Mock).mock.calls[0][1];
    await job();

    expect(zigbeeService.publishEvent).toHaveBeenCalledWith(
      task.actionJobs[0].assignedDeviceId,
      JSON.stringify(task.actionJobs[0].payload)
    );
  });

  function prepareTask(): Task {
    return {
      daysOfWeek: null,
      actionJobs: [
        {
          executionTime: new Date(),
          payload: { action: 'on' },
          assignedDeviceId: 'abc',
          id: 1,
          task: new Task(),
          daysOfWeek: null,
          runOnVacation: true,
        },
      ],
      isActive: false,
      name: '',
      id: 1,
    };
  }
});
