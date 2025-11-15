import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HomeDevice } from '@sparrow-server/entities';
import { DeviceProfile, ZigbeeDeviceService } from '@sparrow-server/external-api';
import { PushNotificationService } from '@sparrow-server/push';
import { Subject } from 'rxjs';

import { GetAlarmModeResponse } from '../controller/model/get-alarm-mode.response';
import { AlarmService } from './alarm.service';

describe('AlarmService', () => {
  let service: AlarmService;
  let mockedZigbeeService: { publishEvent: Subject<void>; devices: Map<string, DeviceProfile> };
  const mockedPushNotificationService: { notify: jest.Mock } = { notify: jest.fn() };

  beforeEach(async () => {
    const modeuleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AlarmService,
        { provide: ZigbeeDeviceService, useValue: { publishEvent: new Subject(), devices: new Map() } },
        { provide: PushNotificationService, useValue: mockedPushNotificationService },
        { provide: getRepositoryToken(HomeDevice), useValue: { findOneBy: jest.fn() } },
      ],
    }).compile();

    mockedZigbeeService = modeuleRef.get(ZigbeeDeviceService);
    service = modeuleRef.get(AlarmService);
  });

  describe('arm alarm', () => {
    it('should arm alarm', async () => {
      const isActive: boolean = true;

      await service.setAlarmMode(isActive);
      const response: GetAlarmModeResponse = await service.getAlarmMode();

      expect(response.isActive).toEqual(isActive);
    });

    it('should ignore open door sensors that are opened', async () => {
      const openedWindow: DeviceProfile = prepareDeviceProfile({
        state: { contact: false },
        deviceIdentity: { friendlyName: 'first', ieee: '' },
      });
      const closedWindow: DeviceProfile = prepareDeviceProfile({
        state: { contact: true },
        deviceIdentity: { friendlyName: 'second', ieee: '' },
      });

      mockedZigbeeService.devices = new Map([
        [openedWindow.deviceIdentity.friendlyName, openedWindow],
        [closedWindow.deviceIdentity.friendlyName, closedWindow],
      ]);

      await service.setAlarmMode(true);
      expect(service['_ignoredDevices'].has(openedWindow.deviceIdentity.friendlyName)).toBeTruthy();
    });
  });

  function prepareDeviceProfile(profile: Partial<DeviceProfile>): DeviceProfile {
    return {
      actions: [],
      deviceDefinition: {},
      deviceIdentity: { friendlyName: '', ieee: '' },
      readonlyFields: [],
      state: {},
      ...profile,
    };
  }
});
