import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@sparrow-server/auth';
import { DeviceType } from '@sparrow-server/entities';
import { firstValueFrom, of } from 'rxjs';

import { HomeDeviceDetailsDto } from '../models/home-device-details-dto';
import { HomeDeviceService } from '../services/home-device/home-device.service';
import { PetFeederOperationsService } from '../services/pet-feeder-operations/pet-feeder-operations.service';
import { HomeDeviceController } from './home-device.controller'; // ← adjust path
import { ChangeDeviceNameRequest } from './models/change-device-name.request';
import { CreateDeviceRequest } from './models/create-device-request';
import { GetAllDeviceFilters } from './models/get-all-device-filters';
import { GetDeviceDetailsResponse } from './models/get-device-details-response';
import { GetHomeAvgTemperature } from './models/get-home-avg-temperature';
import { SetPetFeederConfig } from './models/set-pet-feeder-config';
import { SetPluginSwitchStatusRequest } from './models/set-plugin-switch-status.request';

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
  } as unknown as jest.Mocked<HomeDeviceService>;

  const petFeederServiceMock: jest.Mocked<PetFeederOperationsService> = {
    feedPet: jest.fn(),
    setPetFeederOptions: jest.fn(),
  } as unknown as jest.Mocked<PetFeederOperationsService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeDeviceController],
      providers: [
        { provide: HomeDeviceService, useValue: homeDeviceServiceMock },
        { provide: PetFeederOperationsService, useValue: petFeederServiceMock },
      ],
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
      homeDeviceServiceMock.addDevice.mockReturnValue(of(true));

      const result: boolean = await firstValueFrom(controller.createDevice(req));

      expect(homeDeviceServiceMock.addDevice).toHaveBeenCalledWith(req.type, req.name);
      expect(result).toBe(true);
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
        homeDeviceId: '',
        isOnline: false,
        name: '',
        signalStrength: 0,
        type: DeviceType.SIREN,
        id: 9,
      };
      homeDeviceServiceMock.getDeviceDetails.mockReturnValue(of(details));

      const result: GetDeviceDetailsResponse = await firstValueFrom(controller.getDeviceDetails('9'));

      const expected: GetDeviceDetailsResponse = { deviceDetails: details };
      expect(homeDeviceServiceMock.getDeviceDetails).toHaveBeenCalledWith(9);
      expect(result).toEqual(expected);
    });
  });

  describe('setPluginSwitchStatus', () => {
    it('parses id to number, passes isOn to service and returns observable result', async () => {
      const req: SetPluginSwitchStatusRequest = { isOn: true };
      homeDeviceServiceMock.setPluginSwitchStatus.mockReturnValue(of(true));

      const result: boolean = await firstValueFrom(controller.setPluginSwitchStatus('5', req));

      expect(homeDeviceServiceMock.setPluginSwitchStatus).toHaveBeenCalledWith(5, true);
      expect(result).toBe(true);
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

      const result: boolean | null = await controller.areAllDoorsAndWindowsClosed();

      expect(homeDeviceServiceMock.areAllDoorsAndWindowsClosed).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('returns null from service when applicable', async () => {
      homeDeviceServiceMock.areAllDoorsAndWindowsClosed.mockResolvedValue(null);

      const result: boolean | null = await controller.areAllDoorsAndWindowsClosed();

      expect(result).toBeNull();
    });
  });

  describe('feedPet', () => {
    it('should call feed pet', async () => {
      await controller.feedPet('2');

      expect(petFeederServiceMock.feedPet).toHaveBeenNthCalledWith(1, 2);
    });

    it('should set pet feeder options', async () => {
      const request: SetPetFeederConfig = { portionSize: 1, numberOfPortions: 1 };

      await controller.setPetFeederConfig('1', request);

      expect(petFeederServiceMock.setPetFeederOptions).toHaveBeenNthCalledWith(1, 1, request);
    });
  });
});
