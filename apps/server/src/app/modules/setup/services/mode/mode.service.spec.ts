import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CronJobName } from '../../../../enums/cron-job-name';
import { Mode } from '../../../../enums/mode';
import { CloudConnectionService } from '../../../cloud/services/cloud-connection/cloud-connection.service';
import { Setup } from '../../enitites/setup';
import { ModeService } from './mode.service';
import Mock = jest.Mock;
import { SPRING_AUTUMN_JOBS, SUMMER_JOBS, WINTER_JOBS } from './mode-cron-jobs/mode-crone-jobs';

describe('ModeService', () => {
  let service: ModeService;
  let scheduleRegistry: SchedulerRegistry;
  let setupRepository: Repository<Setup>;
  let cloudConnectionService: CloudConnectionService;

  const mockedCronJob: { stop: Mock; start: Mock } = {
    stop: jest.fn(),
    start: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModeService,
        {
          provide: getRepositoryToken(Setup),
          useValue: {
            save: jest.fn(() => Promise.resolve()),
            find: jest.fn(() => Promise.resolve([{ mode: undefined }])),
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
    setupRepository = module.get(getRepositoryToken(Setup));
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
      await service.setMode(Mode.WINTER);
      expect(setupRepository.save).toHaveBeenNthCalledWith(1, { mode: Mode.WINTER });
      expect(scheduleRegistry.getCronJob).toHaveBeenCalledTimes(Object.values(CronJobName).length);
      expect(mockedCronJob.stop).toHaveBeenCalledTimes(Object.values(CronJobName).length);
    });

    it('should turn off heat when setting summer mode', async () => {
      await service.setMode(Mode.SUMMER);
      expect(cloudConnectionService.setHeatOnly).toHaveBeenNthCalledWith(1, false);
      expect(mockedCronJob.start).toHaveBeenCalledTimes(Object.values(SUMMER_JOBS).length);
    });

    it('should run spring / autumn jobs', async () => {
      await service.setMode(Mode.AUTUMN_SPRING);
      expect(mockedCronJob.start).toHaveBeenCalledTimes(Object.values(SPRING_AUTUMN_JOBS).length);
    });

    it('should run winter jobs', async () => {
      await service.setMode(Mode.WINTER);
      expect(mockedCronJob.start).toHaveBeenCalledTimes(Object.values(WINTER_JOBS).length);
    });
  });
});
