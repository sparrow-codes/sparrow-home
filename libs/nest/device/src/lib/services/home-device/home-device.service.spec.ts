// home-device.service.spec.ts
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HomeDevice } from '@sparrow-server/entities';
import {
  DeviceResponse,
  SensorDetails,
  ZigbeeManageDeviceService,
  ZigbeeSensorService,
  ZigbeeSwitchMqttService,
} from '@sparrow-server/external-api';
import { of, Subject } from 'rxjs';
import { ObjectLiteral, Repository } from 'typeorm';

import { HomeDeviceService } from './home-device.service'; // ← dostosuj ścieżkę

type RepoMock<T extends ObjectLiteral> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createRepositoryMock = <T extends ObjectLiteral>(): RepoMock<T> => ({
  findBy: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const zigbeeSwitchMqttServiceMock: jest.Mocked<ZigbeeSwitchMqttService> = {
  getSwitchStatus: jest.fn(),
  setSwitchOn: jest.fn(),
} as unknown as jest.Mocked<ZigbeeSwitchMqttService>;

const zigbeeManageDeviceServiceMock: jest.Mocked<ZigbeeManageDeviceService> = {
  joinDeviceAndSetId: jest.fn(),
  removeDevice: jest.fn(),
} as unknown as jest.Mocked<ZigbeeManageDeviceService>;

const sensorDetails$ = new Subject<DeviceResponse<SensorDetails>>();
const zigbeeSensorServiceMock: jest.Mocked<ZigbeeSensorService> = {
  sensorDetails$,
  clearListeners: jest.fn(),
  subscribeToSensor: jest.fn(),
} as unknown as jest.Mocked<ZigbeeSensorService>;

let moduleRef: TestingModule;
let service: HomeDeviceService;
let repo: RepoMock<HomeDevice>;

let logSpy: jest.SpyInstance;
let warnSpy: jest.SpyInstance;
let errorSpy: jest.SpyInstance;

describe('HomeDeviceService', () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    repo = createRepositoryMock<HomeDevice>();
    (repo.findBy as jest.Mock).mockResolvedValue([]);

    (repo.findOneBy as jest.Mock).mockResolvedValue(null);
    (repo.save as jest.Mock).mockResolvedValue(undefined);
    (repo.delete as jest.Mock).mockResolvedValue({} as any);

    zigbeeSwitchMqttServiceMock.getSwitchStatus.mockReturnValue(of(null as any));
    zigbeeSwitchMqttServiceMock.setSwitchOn.mockReturnValue(of(true));
    zigbeeManageDeviceServiceMock.joinDeviceAndSetId.mockReturnValue(of('zig-xyz'));
    zigbeeManageDeviceServiceMock.removeDevice.mockResolvedValue(undefined);

    (zigbeeSensorServiceMock as any).sensorDetails$ = new Subject<DeviceResponse<SensorDetails>>();

    logSpy = jest.spyOn(Logger, 'log').mockImplementation(() => {});
    warnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});
    errorSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {});

    moduleRef = await Test.createTestingModule({
      providers: [
        HomeDeviceService,
        { provide: getRepositoryToken(HomeDevice), useValue: repo },
        { provide: ZigbeeSwitchMqttService, useValue: zigbeeSwitchMqttServiceMock },
        { provide: ZigbeeManageDeviceService, useValue: zigbeeManageDeviceServiceMock },
        { provide: ZigbeeSensorService, useValue: zigbeeSensorServiceMock },
      ],
    }).compile();

    service = moduleRef.get(HomeDeviceService);
  });

  afterEach(async () => {
    // complete sensor stream to avoid lingering subscriptions
    const stream = (zigbeeSensorServiceMock as any).sensorDetails$ as Subject<DeviceResponse<SensorDetails>>;
    stream.complete?.();

    logSpy?.mockRestore();
    warnSpy?.mockRestore();
    errorSpy?.mockRestore();

    await moduleRef?.close();
  });

  describe('getListOfDevices', () => {
    // it.todo('returns aggregated device details based on deviceType branching');
  });

  describe('addDevice', () => {
    // it.todo('saves new device when joinDeviceAndSetId returns id');
    // it.todo('returns false when joinDeviceAndSetId returns empty string');
  });

  describe('changeDeviceName', () => {
    // it.todo('updates device name when entity exists');
    // it.todo('throws NotFoundException when entity is missing');
  });

  describe('removeDevice', () => {
    // it.todo('removes device and calls removeDevice on zigbeeManageDeviceService');
    // it.todo('no-op when entity does not exist');
  });

  describe('getDeviceDetails', () => {
    // it.todo('returns mapped details for POWER_PLUG (calls getSwitchStatus and mapper)');
    // it.todo('throws NotFoundException when entity is missing');
  });

  describe('setPluginSwitchStatus', () => {
    // it.todo('delegates to setSwitchOn with zigbee id');
    // it.todo('throws NotFoundException when entity is missing');
  });

  describe('getAvgTemperature', () => {
    // it.todo('returns null when no sensors or no temps');
    // it.todo('returns rounded avg to 0.1');
  });

  describe('areAllDoorsAndWindowsClosed', () => {
    // it.todo('returns null when there are no open sensors');
    // it.todo('returns true when all are closed, false otherwise');
  });

  describe('private: _subscribeToSensors & handleSensorEvent', () => {
    // Hint: trigger sensor event by emitting on sensorDetails$:
    // (zigbeeSensorServiceMock as any).sensorDetails$.next({ deviceId: 'zig-1', payload: { ... } } as any);
    // it.todo('subscribes to current sensors and sets up listeners');
    // it.todo('updates entity fields on incoming sensor event');
  });
});
