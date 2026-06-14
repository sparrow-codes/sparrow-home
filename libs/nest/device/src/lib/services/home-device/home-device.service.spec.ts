import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DeviceType, HomeDevice } from '@sparrow-server/entities';
import { ZigbeeDeviceService, ZigbeeManageDeviceService } from '@sparrow-server/external-api';
import { DeviceJoined } from '@sparrow-server/shared';
import { firstValueFrom, of } from 'rxjs';

import { HomeDeviceService } from './home-device.service';

describe('HomeDeviceService', () => {
  let service: HomeDeviceService;

  const repositoryMock: Record<string, never> = {};

  const queryBuilderMock = {
    insert: jest.fn(),
    into: jest.fn(),
    values: jest.fn(),
    orUpdate: jest.fn(),
    execute: jest.fn(),
  };

  const dataSourceMock = {
    createQueryBuilder: jest.fn(() => queryBuilderMock),
  };

  const zigbeeManageDeviceServiceMock: {
    joinDeviceAndSetId: jest.Mock;
  } = {
    joinDeviceAndSetId: jest.fn(),
  };

  const zigbeeDeviceServiceMock: {
    devices: Map<string, unknown>;
  } = {
    devices: new Map<string, unknown>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    queryBuilderMock.insert.mockReturnValue(queryBuilderMock);
    queryBuilderMock.into.mockReturnValue(queryBuilderMock);
    queryBuilderMock.values.mockReturnValue(queryBuilderMock);
    queryBuilderMock.orUpdate.mockReturnValue(queryBuilderMock);
    queryBuilderMock.execute.mockResolvedValue({});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeDeviceService,
        {
          provide: getRepositoryToken(HomeDevice),
          useValue: repositoryMock,
        },
        {
          provide: getDataSourceToken(),
          useValue: dataSourceMock,
        },
        {
          provide: ZigbeeManageDeviceService,
          useValue: zigbeeManageDeviceServiceMock,
        },
        {
          provide: ZigbeeDeviceService,
          useValue: zigbeeDeviceServiceMock,
        },
      ],
    }).compile();

    service = module.get<HomeDeviceService>(HomeDeviceService);
  });

  describe('addDevice', () => {
    it('returns null when zigbee join result is empty', async () => {
      zigbeeManageDeviceServiceMock.joinDeviceAndSetId.mockReturnValue(of(null));

      const result: number | null = await firstValueFrom(service.addDevice(DeviceType.SIREN, 'Siren'));

      expect(result).toBeNull();
      expect(dataSourceMock.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('performs insert-or-update with query builder and returns id from identifiers', async () => {
      const joinedDevice: DeviceJoined = { friendly_name: 'kitchen_switch' } as DeviceJoined;

      zigbeeManageDeviceServiceMock.joinDeviceAndSetId.mockReturnValue(of(joinedDevice));
      queryBuilderMock.execute.mockResolvedValue({ identifiers: [{ id: 77 }] });

      const result: number | null = await firstValueFrom(service.addDevice(DeviceType.OPEN_DOOR_SENSOR, 'Door Sensor'));

      expect(dataSourceMock.createQueryBuilder).toHaveBeenCalled();
      expect(queryBuilderMock.insert).toHaveBeenCalled();
      expect(queryBuilderMock.into).toHaveBeenCalledWith(HomeDevice);
      expect(queryBuilderMock.values).toHaveBeenCalledWith({
        zigbeeDeviceId: 'kitchen_switch',
        deviceType: DeviceType.OPEN_DOOR_SENSOR,
        deviceName: 'Door Sensor',
        zigbeeDeviceData: joinedDevice,
      });
      expect(queryBuilderMock.orUpdate).toHaveBeenCalledWith(
        ['deviceType', 'deviceName', 'zigbeeDeviceData'],
        ['zigbeeDeviceId']
      );
      expect(queryBuilderMock.execute).toHaveBeenCalled();

      expect(result).toBe(77);
    });
  });
});
