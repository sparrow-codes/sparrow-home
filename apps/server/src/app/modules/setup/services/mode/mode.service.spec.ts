import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';

import { CronJobName } from '../../../../enums/cron-job-name';
import { Mode } from '../../../../enums/mode';
import { CloudConnectionService } from '../../../cloud/services/cloud-connection/cloud-connection.service';
import { UserService } from '../../../user/services/user.service';
import { ModeService } from './mode.service';
import { SPRING_AUTUMN_JOBS, SUMMER_JOBS, WINTER_JOBS } from './mode-cron-jobs/mode-crone-jobs';
import Mock = jest.Mock;

describe('ModeService', () => {
  let service: ModeService;
  let scheduleRegistry: SchedulerRegistry;
  let cloudConnectionService: CloudConnectionService;

  const mockedCronJob: { stop: Mock; start: Mock } = {
    stop: jest.fn(),
    start: jest.fn(),
  };

  const unitId: number = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModeService,
        {
          provide: UserService,
          useValue: {
            save: jest.fn(() => Promise.resolve()),
            getUserById: jest.fn(() => Promise.resolve({ setup: { mode: undefined } })),
          },
        },
        {
          provide: SchedulerRegistry,
          useValue: {
            getCronJob: jest.fn(() => mockedCronJob),
            doesExist: jest.fn(() => true),
          },
        },
        {
          provide: CloudConnectionService,
          useValue: { setHeatOnly: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ModeService>(ModeService);
    scheduleRegistry = module.get(SchedulerRegistry);
    cloudConnectionService = module.get(CloudConnectionService);
  });

  describe('service init', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('save mode', () => {
    beforeEach(() => {
      mockedCronJob.stop.mockReset();
      mockedCronJob.start.mockReset();
    });

    it('should save mode', async () => {
      await service.setMode(Mode.WINTER, unitId);
      expect(scheduleRegistry.getCronJob).toHaveBeenCalledTimes(Object.values(CronJobName).length);
      expect(mockedCronJob.stop).toHaveBeenCalledTimes(Object.values(CronJobName).length);
    });

    it('should turn off heat when setting summer mode', async () => {
      await service.setMode(Mode.SUMMER, unitId);
      expect(cloudConnectionService.setHeatOnly).toHaveBeenNthCalledWith(1, false);
      expect(mockedCronJob.start).toHaveBeenCalledTimes(Object.values(SUMMER_JOBS).length);
    });

    it('should run spring / autumn jobs', async () => {
      await service.setMode(Mode.AUTUMN_SPRING, unitId);
      expect(mockedCronJob.start).toHaveBeenCalledTimes(Object.values(SPRING_AUTUMN_JOBS).length);
    });

    it('should run winter jobs', async () => {
      await service.setMode(Mode.WINTER, unitId);
      expect(mockedCronJob.start).toHaveBeenCalledTimes(Object.values(WINTER_JOBS).length);
    });
  });
});
