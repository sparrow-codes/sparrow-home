import { TestBed } from '@angular/core/testing';
import { AlarmApiService } from '@sparrow-home/api';
import { of } from 'rxjs';

import { AlarmFacadeDataService } from './alarm-facade-data.service';

describe('AlarmFacadeDataService', () => {
  let service: AlarmFacadeDataService;
  let alarmApiService: AlarmApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AlarmFacadeDataService,
        {
          provide: AlarmApiService,
          useValue: {
            getAlarmMode: jest.fn(() => of(true)),
            setAlarm: jest.fn(),
            setAlarmMode: jest.fn(),
          },
        },
      ],
    })
      .compileComponents()
      .then(() => {
        service = TestBed.inject(AlarmFacadeDataService);
        alarmApiService = TestBed.inject(AlarmApiService);
      });
  });

  describe('service init', () => {
    it('should create service', () => {
      expect(service).toBeTruthy();
    });

    it('should set active alarm mode to false', () => {
      expect(service.alarmMode()).toBe(false);
    });
  });

  describe('set alarm', () => {
    it('should call set alarm api service', () => {
      const isOn: boolean = true;
      service.setAlarm(isOn);

      expect(alarmApiService.setAlarm).toHaveBeenNthCalledWith(1, { body: { isOn } });
    });
  });

  describe('get alarm mode', () => {
    it('should store alarm mode from api service', () => {
      service.fetchAlarmMode();
      expect(service.alarmMode()).toBe(true);
    });
  });

  describe('set alarm mode', () => {
    it('should set alarm mode', () => {
      const isActive: boolean = true;
      service.setAlarmMode(isActive);

      expect(alarmApiService.setAlarmMode).toHaveBeenNthCalledWith(1, { body: { isActive } });
    });
  });
});
