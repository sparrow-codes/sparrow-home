import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';

import { CloudConnectionService } from '../../../cloud/services/cloud-connection/cloud-connection.service';
import { Setup } from '../../../setup/enitites/setup';
import { WeatherService } from '../../../waether/services/weather.service';
import { CloudTaskService } from './cloud-task.service';

describe('CloudTaskService', () => {
  let service: CloudTaskService;
  let scheduleRegistry: SchedulerRegistry;

  const sunset: string = '2024-10-17T20:00';
  const sunrise: string = '2024-10-18T08:00';
  const marginTemperature: number = 7;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudTaskService,
        {
          provide: WeatherService,
          useValue: {
            getSunriseAndSunsetWithLowestTemperature: jest.fn(() =>
              of({
                sunrise: new Date(sunrise),
                sunset: new Date(sunset),
                lowestTemperature: 6,
              })
            ),
          },
        },
        {
          provide: getRepositoryToken(Setup),
          useValue: { find: jest.fn(() => Promise.resolve([{ marginTemperatureOverNight: marginTemperature }])) },
        },
        {
          provide: SchedulerRegistry,
          useValue: { addCronJob: jest.fn() },
        },
        {
          provide: CloudConnectionService,
          useValue: { setHeatOnly: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<CloudTaskService>(CloudTaskService);
    scheduleRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
  });

  describe('service init', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('check temperature over night', () => {
    it('should schedule heating on 2 hours before sunset', async () => {
      jest.spyOn(scheduleRegistry, 'addCronJob');

      await service.turnHeatIfColdNight();
      expect(scheduleRegistry.addCronJob).toHaveBeenCalledTimes(2);
    });
  });
});
