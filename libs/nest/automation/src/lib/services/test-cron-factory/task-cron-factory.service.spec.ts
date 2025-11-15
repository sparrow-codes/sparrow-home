import { Test, TestingModule } from '@nestjs/testing';
import { TaskCronFactory } from './task-cron-factory.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ZigbeeDeviceService } from '@sparrow-server/external-api';
import { Task } from '@sparrow-server/entities';
import { CronJob } from 'cron';

jest.mock('cron', () => {
  return {
    CronJob: jest.fn().mockImplementation((_, cb) => ({ start: jest.fn(), callback: cb, nextDate: jest.fn() })),
  };
});

describe('TaskCronFactory', () => {
  let factory: TaskCronFactory;
  let schedulerRegistry: jest.Mocked<SchedulerRegistry>;
  let zigbeeService: jest.Mocked<ZigbeeDeviceService>;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskCronFactory,
        { provide: SchedulerRegistry, useValue: schedulerRegistry },
        { provide: ZigbeeDeviceService, useValue: zigbeeService },
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

  it('should activate power plug device', () => {
    const task: Task = prepareTask();

    factory.scheduleTask(task);
    const job = (CronJob as unknown as jest.Mock).mock.calls[0][1];
    job();
    expect(zigbeeService.publishEvent).toHaveBeenCalledWith(
      task.actionJobs[0].assignedDeviceId,
      task.actionJobs[0].payload
    );
  });

  function prepareTask(): Task {
    return {
      actionJobs: [
        {
          executionTime: new Date(),
          payload: '{ action: "on" }',
          assignedDeviceId: 'abc',
          id: 1,
          task: new Task(),
        },
      ],
      isActive: false,
      name: '',
      id: 1,
    };
  }
});
