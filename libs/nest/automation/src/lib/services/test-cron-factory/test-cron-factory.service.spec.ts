import { Test, TestingModule } from '@nestjs/testing';
import { TaskCronFactory } from './test-cron-factory.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ZigbeePetFeederService, ZigbeeSwitchMqttService } from '@sparrow-server/external-api';
import { DeviceType } from '@sparrow-server/entities';
import { CronJob } from 'cron';

jest.mock('cron', () => {
  return {
    CronJob: jest.fn().mockImplementation((_, cb) => ({ start: jest.fn(), callback: cb, nextDate: jest.fn() })),
  };
});

describe('TaskCronFactory', () => {
  let factory: TaskCronFactory;
  let schedulerRegistry: jest.Mocked<SchedulerRegistry>;
  let zigbeeService: jest.Mocked<ZigbeeSwitchMqttService>;
  let zigbeePetFeederService: jest.Mocked<ZigbeePetFeederService>;

  beforeEach(async () => {
    (CronJob as unknown as jest.Mock).mockClear();

    schedulerRegistry = {
      addCronJob: jest.fn(),
      deleteCronJob: jest.fn(),
      doesExist: jest.fn().mockReturnValue(true),
    } as any;

    zigbeeService = {
      setSwitchOn: jest.fn(),
    } as any;

    zigbeePetFeederService = { feedPet: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskCronFactory,
        { provide: SchedulerRegistry, useValue: schedulerRegistry },
        { provide: ZigbeeSwitchMqttService, useValue: zigbeeService },
        { provide: ZigbeePetFeederService, useValue: zigbeePetFeederService },
      ],
    }).compile();

    factory = module.get(TaskCronFactory);
  });

  it('should clear scheduled jobs', () => {
    factory.clearScheduledTask(1);
    expect(schedulerRegistry.deleteCronJob).toHaveBeenCalledTimes(2);
  });

  it('should skip scheduling if task is misconfigured', () => {
    const task = { id: 1, startTime: null, endTime: null, homeDevices: [] } as any;
    factory.scheduleTask(task);
    expect(schedulerRegistry.addCronJob).not.toHaveBeenCalled();
  });

  it('should schedule valid task and create jobs', () => {
    const task = {
      id: 1,
      startTime: new Date(),
      endTime: new Date(),
      homeDevices: [{ deviceType: DeviceType.POWER_PLUG, zigbeeDeviceId: 'abc' }],
    } as any;

    factory.scheduleTask(task);
    expect(schedulerRegistry.addCronJob).toHaveBeenCalledTimes(2);
  });

  it('should activate power plug device', () => {
    const task = {
      id: 1,
      startTime: new Date(),
      endTime: new Date(),
      homeDevices: [{ deviceType: DeviceType.POWER_PLUG, zigbeeDeviceId: 'abc' }],
    } as any;

    factory.scheduleTask(task);
    const job = (CronJob as unknown as jest.Mock).mock.calls[0][1];
    job();
    expect(zigbeeService.setSwitchOn).toHaveBeenCalledWith('abc', true);
  });

  it('should activate pet feeder', () => {
    const task = {
      id: 1,
      startTime: new Date(),
      endTime: new Date(),
      homeDevices: [{ deviceType: DeviceType.PET_FEEDER, zigbeeDeviceId: 'abc' }],
    } as any;

    factory.scheduleTask(task);
    const job = (CronJob as unknown as jest.Mock).mock.calls[0][1];
    job();
    expect(zigbeePetFeederService.feedPet).toHaveBeenNthCalledWith(1, 'abc');
  });

  it('should log unsupported device types', () => {
    const task = {
      id: 2,
      startTime: new Date(),
      endTime: new Date(),
      homeDevices: [{ deviceType: 999, id: 42 }],
    } as any;

    factory.scheduleTask(task);
    const job = (CronJob as unknown as jest.Mock).mock.calls[0][1];
    job();
    expect(zigbeeService.setSwitchOn).not.toHaveBeenCalled();
  });
});
