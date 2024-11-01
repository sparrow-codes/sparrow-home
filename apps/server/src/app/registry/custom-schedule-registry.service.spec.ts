import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { CloudConnectionService } from '../modules/cloud/services/cloud-connection/cloud-connection.service';
import { UserService } from '../modules/user/services/user.service';
import { WeatherService } from '../modules/waether/services/weather.service';
import { CustomScheduleRegistryService } from './custom-schedule-registry.service';

describe('CustomScheduleRegistryService', () => {
  let service: CustomScheduleRegistryService;

  const sunset: string = new Date(new Date().setHours(new Date().getHours() + 8)).toISOString();
  const sunrise: string = new Date(new Date().setHours(new Date().getHours() + 16)).toISOString();
  const marginTemperature: number = 7;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomScheduleRegistryService,
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
            getUserByRole: jest.fn(() =>
              Promise.resolve({ setup: { marginTemperatureOverNight: marginTemperature }, cloudPreferences: {} })
            ),
            save: jest.fn(),
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

    service = module.get<CustomScheduleRegistryService>(CustomScheduleRegistryService);
  });

  describe('service init', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });
});
