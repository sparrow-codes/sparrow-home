import { Test, TestingModule } from '@nestjs/testing';
import { TaskDtoMapperService } from './task-dto-mapper.service';
import { ActionJob, HomeDevice, Task } from '@sparrow-server/entities';
import { DeviceProfile, ZigbeeDeviceService } from '@sparrow-server/external-api';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskDto } from '../controller/task/model/task-dto';

describe('TaskDtoMapperService', () => {
  let service: TaskDtoMapperService;
  const deviceID: string = 'zig-1';
  const mockedDevice: HomeDevice = prepareHomeDevice();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskDtoMapperService,
        { provide: ZigbeeDeviceService, useValue: { devices: new Map([[deviceID, prepareDeviceProfile()]]) } },
        { provide: getRepositoryToken(HomeDevice), useValue: { findOneBy: () => mockedDevice } },
      ],
    }).compile();

    service = module.get<TaskDtoMapperService>(TaskDtoMapperService);
  });

  describe('service init', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('map', () => {
    it('should map task', () => {
      const task: Task = prepareTask([]);
      expect(service.map(task)).toBeTruthy();
    });

    it('should contain empty list of jobs', async () => {
      const task: Task = prepareTask([]);
      expect((await service.map(task)).actions.length).toBe(0);
    });

    it('should contain empty list of jobs on null actions', async () => {
      const task: Task = prepareTask(null as never);
      expect((await service.map(task)).actions?.length).toBe(0);
    });

    it('should contain one action', async () => {
      const task: Task = prepareTask([prepareAction({ switch: 'currentValue' })]);
      const dto: TaskDto = await service.map(task);
      expect(dto.actions.length).toBe(1);
      expect(dto.actions[0].action?.key).toBe('switch');
      expect(dto.actions[0].action?.currentValue).toBe('currentValue');
      expect(dto.actions[0].executionTime).toBeDefined();
      expect(dto.actions[0].deviceName).toBe(mockedDevice.deviceName);
      expect(dto.actions[0].deviceDescription).toBe('description');
      expect(dto.actions[0].daysOfTheWeek).toStrictEqual([1, 2]);
    });
  });

  function prepareHomeDevice(): HomeDevice {
    return {
      mainActionKey: null,
      mainParamKey: null,
      deviceName: 'Device Name',
      deviceType: 0,
      id: 0,
      lastChanged: new Date(),
      zigbeeDeviceId: deviceID,
    };
  }

  function prepareTask(actionJobs: ActionJob[]): Task {
    return {
      daysOfWeek: [1, 2],
      actionJobs,
      id: 0,
      isActive: true,
      name: 'Task name',
    };
  }

  function prepareAction(payload: Record<string, unknown>): ActionJob {
    return {
      assignedDeviceId: deviceID,
      executionTime: new Date(),
      id: 0,
      payload,
      daysOfWeek: [1, 2],
      task: null as never,
    };
  }

  function prepareDeviceProfile(): DeviceProfile {
    return {
      actions: [
        {
          type: 'number',
          writable: true,
          readable: true,
          key: 'switch',
          appearsInState: true,
          supportsGet: false,
          unit: '$',
          range: {
            min: 0,
            max: 100,
          },
          path: ['/set/switch'],
          enumValues: ['on', 'off'],
        },
        {
          type: 'boolean',
          writable: true,
          readable: true,
          key: 'turn',
          appearsInState: true,
          supportsGet: false,
          path: ['/set/turn'],
        },
      ],
      deviceDefinition: {
        description: 'description',
      },
      deviceIdentity: {
        ieee: '',
        friendlyName: deviceID,
      },
      readonlyFields: [],
      state: {
        switch: 'on',
      },
    };
  }
});
