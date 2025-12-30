import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@sparrow-server/auth';
import { DeviceType } from '@sparrow-server/entities';
import { firstValueFrom, of } from 'rxjs';

import { HomeDeviceDetailsDto } from '../models/home-device-details-dto';
import { HomeDeviceService } from '../services/home-device/home-device.service';
import { HomeDeviceController } from './home-device.controller'; // ← adjust path
import { ChangeDeviceNameRequest } from './models/change-device-name.request';
import { CreateDeviceRequest } from './models/create-device-request';
import { GetAllDeviceFilters } from './models/get-all-device-filters';
import { GetDeviceDetailsResponse } from './models/get-device-details-response';
import { GetHomeAvgTemperature } from './models/get-home-avg-temperature';
import { PublishEventRequest } from './models/publish-event-request';
import { SetDeviceSettingsRequest } from './models/set-device-settings-request';

describe('HomeDeviceController', () => {
  let controller: HomeDeviceController;

  const homeDeviceServiceMock: jest.Mocked<HomeDeviceService> = {
    getListOfDevices: jest.fn(),
    addDevice: jest.fn(),
    changeDeviceName: jest.fn(),
    removeDevice: jest.fn(),
    getDeviceDetails: jest.fn(),
    setPluginSwitchStatus: jest.fn(),
    getAvgTemperature: jest.fn(),
    areAllDoorsAndWindowsClosed: jest.fn(),
    publishEvent: jest.fn(),
    setDeviceSettings: jest.fn(),
  } as unknown as jest.Mocked<HomeDeviceService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeDeviceController],
      providers: [{ provide: HomeDeviceService, useValue: homeDeviceServiceMock }],
    })
      .overrideGuard(AuthGuard)
      .useValue({})
      .compile();

    controller = module.get(HomeDeviceController);
  });

  describe('getAllDevices', () => {
    it('passes filters to service and returns list from observable', async () => {
      const filters: GetAllDeviceFilters = {};
      const list: HomeDeviceDetailsDto[] = [{ id: 1 } as never, { id: 2 } as never];

      homeDeviceServiceMock.getListOfDevices.mockReturnValue(of(list));

      const result: HomeDeviceDetailsDto[] = await firstValueFrom(controller.getAllDevices(filters));

      expect(homeDeviceServiceMock.getListOfDevices).toHaveBeenCalledWith(filters);
      expect(result).toEqual(list);
    });

    it('works when filters are undefined', async () => {
      const list: HomeDeviceDetailsDto[] = [
        {
          id: 3,
          type: 0,
          homeDeviceId: '',
          name: '',
          isOnline: false,
          signalStrength: 0,
          vendor: '',
          model: '',
          description: '',
          battery: null,
          params: {},
          actions: [],
          mainActionKey: null,
          mainParamKey: null,
        },
      ];

      homeDeviceServiceMock.getListOfDevices.mockReturnValue(of(list));

      const result: HomeDeviceDetailsDto[] = await firstValueFrom(controller.getAllDevices(undefined));

      expect(homeDeviceServiceMock.getListOfDevices).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(list);
    });
  });

  describe('createDevice', () => {
    it('calls service with request fields and returns observable result', async () => {
      const req: CreateDeviceRequest = { type: 7, name: 'Bedroom Plug' };
      homeDeviceServiceMock.addDevice.mockReturnValue(of(1));

      const result: number | null = await firstValueFrom(controller.createDevice(req));

      expect(homeDeviceServiceMock.addDevice).toHaveBeenCalledWith(req.type, req.name);
      expect(result).toBe(1);
    });
  });

  describe('updateDeviceName', () => {
    it('awaits service call with id and deviceName', async () => {
      const req: ChangeDeviceNameRequest = { id: 42, deviceName: 'New Name' };
      homeDeviceServiceMock.changeDeviceName.mockResolvedValue(void 0);

      await controller.updateDeviceName(req);

      expect(homeDeviceServiceMock.changeDeviceName).toHaveBeenCalledWith(42, 'New Name');
    });
  });

  describe('deleteDevice', () => {
    it('parses id param to number and awaits service call', async () => {
      homeDeviceServiceMock.removeDevice.mockResolvedValue(void 0);

      await controller.deleteDevice('21');

      expect(homeDeviceServiceMock.removeDevice).toHaveBeenCalledWith(21);
    });
  });

  describe('getDeviceDetails', () => {
    it('parses id to number and maps service result to { deviceDetails }', async () => {
      const details: HomeDeviceDetailsDto = {
        actions: [],
        battery: null,
        description: '',
        model: '',
        params: {},
        vendor: '',
        homeDeviceId: '',
        isOnline: false,
        name: '',
        signalStrength: 0,
        type: DeviceType.SIREN,
        id: 9,
        mainParamKey: '',
        mainActionKey: '',
      };
      homeDeviceServiceMock.getDeviceDetails.mockReturnValue(of(details));

      const result: GetDeviceDetailsResponse = await firstValueFrom(controller.getDeviceDetails('9'));

      const expected: GetDeviceDetailsResponse = { deviceDetails: details };
      expect(homeDeviceServiceMock.getDeviceDetails).toHaveBeenCalledWith(9);
      expect(result).toEqual(expected);
    });
  });

  describe('getHomeAvgTemperature', () => {
    it('wraps service numeric result into { avgTemperature }', async () => {
      homeDeviceServiceMock.getAvgTemperature.mockResolvedValue(21.37);

      const result: GetHomeAvgTemperature = await controller.getHomeAvgTemperature();

      expect(homeDeviceServiceMock.getAvgTemperature).toHaveBeenCalled();
      expect(result).toEqual({ avgTemperature: 21.37 });
    });
  });

  describe('areAllDoorsAndWindowsClosed', () => {
    it('returns boolean value from service', async () => {
      homeDeviceServiceMock.areAllDoorsAndWindowsClosed.mockResolvedValue(true);

      const result: boolean | null = (await controller.areAllDoorsAndWindowsClosed()).areAllDoorsAndWindowsClosed;

      expect(homeDeviceServiceMock.areAllDoorsAndWindowsClosed).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('returns null from service when applicable', async () => {
      homeDeviceServiceMock.areAllDoorsAndWindowsClosed.mockResolvedValue(null);

      const result: boolean | null = (await controller.areAllDoorsAndWindowsClosed()).areAllDoorsAndWindowsClosed;

      expect(result).toBeNull();
    });
  });

  describe('publishZigbeeEvent', () => {
    it('should publish zigbee event', () => {
      const request: PublishEventRequest = {
        payload: {},
        deviceId: '',
      };

      controller.publishZigbeeEvent(request);
      expect(homeDeviceServiceMock.publishEvent).toHaveBeenCalledWith(request.deviceId, request.payload);
    });
  });

  describe('update device main fields', () => {
    it('should update device main fields', () => {
      const request: SetDeviceSettingsRequest = {
        mainParamKey: 'param',
        mainActionKey: 'action',
      };
      const id: string = '1';

      controller.setDeviceSettings(id, request);
      expect(homeDeviceServiceMock.setDeviceSettings).toHaveBeenCalledWith(1, request);
    });
  });
});
