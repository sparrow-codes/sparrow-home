import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { CloudConnectionService } from '../../../cloud/services/cloud-connection/cloud-connection.service';
import { UserService } from '../../../user/services/user.service';
import { WeatherService } from '../../../waether/services/weather.service';
import { CloudTaskService } from './cloud-task.service';

describe('CloudTaskService', () => {
  let service: CloudTaskService;
  let scheduleRegistry: SchedulerRegistry;
  let cloudConnectionService: CloudConnectionService;

  const sunset: string = new Date(new Date().setHours(new Date().getHours() + 8)).toISOString();
  const sunrise: string = new Date(new Date().setHours(new Date().getHours() + 16)).toISOString();
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
          provide: UserService,
          useValue: {
            getUserByRole: jest.fn(() => Promise.resolve({ setup: { marginTemperatureOverNight: marginTemperature } })),
          },
        },
        {
          provide: SchedulerRegistry,
          useValue: { addCronJob: jest.fn() },
        },
        {
          provide: CloudConnectionService,
          useValue: { setHeatOnly: jest.fn(), setWaterOnly: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<CloudTaskService>(CloudTaskService);
    scheduleRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
    cloudConnectionService = module.get(CloudConnectionService);
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

  describe('everyday events', () => {
    it('should set water on', () => {
      service.everyDayWaterOn();
      expect(cloudConnectionService.setWaterOnly).toHaveBeenNthCalledWith(1, true);
    });

    it('should set heat on', () => {
      service.everyDayWaterOff();
      expect(cloudConnectionService.setWaterOnly).toHaveBeenNthCalledWith(1, false);
    });
  });
});
