// device-details.mapper.spec.ts
import { DeviceType, HomeDevice } from '@sparrow-server/entities';
import { DeviceResponse, IkeaSwitchStatusResponse } from '@sparrow-server/external-api';

import { DeviceDetailsMapper } from './device-details-mapper'; // ← adjust path

// Mock util to keep tests deterministic
jest.mock('../utils/calculate-percentage', () => ({
  calculatePercentage: jest.fn().mockImplementation((_min: number, _max: number, value: number) => value * 10),
}));
import { OpenDoorSensorDetailsDto } from '../models/open-door-sensor-details-dto';
import { PetFeederDetailsDto } from '../models/pet-feeder-details-dto';
import { PilotDetailsDto } from '../models/pilot-details.dto';
import { PluginSwitchDetailsDto } from '../models/plugin-switch-details.dto';
import { SirenDetailsDto } from '../models/siren-details-dto';
import { TemperatureSensorDetailsDto } from '../models/temperature-sensor-details-dto';
import { calculatePercentage } from '../utils/calculate-percentage';

const baseDevice = (overrides: Partial<HomeDevice> = {}): HomeDevice =>
  ({
    id: 1,
    zigbeeDeviceId: 'zig-1',
    deviceType: DeviceType.POWER_PLUG,
    deviceName: 'Device',
    battery: null,
    signalStrength: null,
    temperature: null,
    isOpen: null,
    lastOpened: null,
    feederPortionSize: null,
    feederNumberOfPortions: null,
    task: undefined,
    ...overrides,
  } as HomeDevice);

describe('DeviceDetailsMapper', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('getSwitchDetails', () => {
    it('sets offline / isOn=false / signalStrength=0 when response is null', () => {
      const result: PluginSwitchDetailsDto = DeviceDetailsMapper.getSwitchDetails(baseDevice(), null);

      expect(result).toEqual({
        type: DeviceType.POWER_PLUG,
        name: 'Device',
        homeDeviceId: 'zig-1',
        id: 1,
        isOnline: false,
        isOn: false,
        signalStrength: 0,
      });
      expect(calculatePercentage).not.toHaveBeenCalled();
    });

    it('sets online / isOn=true and computes signalStrength when state is ON', () => {
      const response: DeviceResponse<IkeaSwitchStatusResponse> = {
        payload: { state: 'ON', linkquality: 60 },
        status: 200,
        requestId: 'req-1',
      } as never;

      const result: PluginSwitchDetailsDto = DeviceDetailsMapper.getSwitchDetails(baseDevice(), response);

      expect(result.isOnline).toBe(true);
      expect(result.isOn).toBe(true);
      expect(result.signalStrength).toBe(600);
      expect(calculatePercentage).toHaveBeenCalledWith(0, 255, 60);
    });

    it('sets isOn=false when state is not ON', () => {
      const response: DeviceResponse<IkeaSwitchStatusResponse> = {
        payload: { state: 'OFF', linkquality: 100 },
        status: 200,
        requestId: 'req-2',
      } as never;

      const result: PluginSwitchDetailsDto = DeviceDetailsMapper.getSwitchDetails(baseDevice(), response);

      expect(result.isOnline).toBe(true);
      expect(result.isOn).toBe(false);
      expect(result.signalStrength).toBe(1000);
    });
  });

  describe('getTemperatureSensorDetails', () => {
    it('maps full data (temperature, battery, online, signalStrength)', () => {
      const entity: HomeDevice = baseDevice({
        deviceType: DeviceType.SONOFF_TEMPERATURE_SENSOR,
        deviceName: 'Bedroom Temp',
        temperature: 21.5,
        signalStrength: 100,
        battery: 88,
      });

      const result: TemperatureSensorDetailsDto = DeviceDetailsMapper.getTemperatureSensorDetails(entity);

      expect(result).toEqual({
        type: DeviceType.SONOFF_TEMPERATURE_SENSOR,
        homeDeviceId: 'zig-1',
        name: 'Bedroom Temp',
        temperature: 21.5,
        signalStrength: 1000,
        isOnline: true,
        battery: 88,
        id: 1,
      });
      expect(calculatePercentage).toHaveBeenCalledWith(0, 255, 100);
    });

    it('returns temperature/battery as undefined, offline, and signalStrength=0 when data is missing', () => {
      const entity: HomeDevice = baseDevice({ deviceType: DeviceType.SONOFF_TEMPERATURE_SENSOR });

      const result: TemperatureSensorDetailsDto = DeviceDetailsMapper.getTemperatureSensorDetails(entity);

      expect(result.temperature).toBeUndefined();
      expect(result.battery).toBeUndefined();
      expect(result.isOnline).toBe(false);
      expect(result.signalStrength).toBe(0);
      expect(calculatePercentage).not.toHaveBeenCalled();
    });
  });

  describe('getOpenDoorSensorDetails', () => {
    it('maps door sensor data (isOpen, lastOpened, online)', () => {
      const date: Date = new Date('2025-01-02T03:04:05.000Z');
      const entity: HomeDevice = baseDevice({
        deviceType: DeviceType.OPEN_DOOR_SENSOR,
        deviceName: 'Front Door',
        signalStrength: 30,
        battery: 50,
        isOpen: true,
        lastOpened: date,
      });

      const result: OpenDoorSensorDetailsDto = DeviceDetailsMapper.getOpenDoorSensorDetails(entity);

      expect(result).toEqual({
        type: DeviceType.OPEN_DOOR_SENSOR,
        homeDeviceId: 'zig-1',
        name: 'Front Door',
        signalStrength: 300,
        isOnline: true,
        battery: 50,
        isOpen: true,
        id: 1,
        lastOpened: date,
      });
      expect(calculatePercentage).toHaveBeenCalledWith(0, 255, 30);
    });

    it('sets isOpen=undefined and offline when data is missing', () => {
      const entity: HomeDevice = baseDevice({ deviceType: DeviceType.OPEN_DOOR_SENSOR });

      const result: OpenDoorSensorDetailsDto = DeviceDetailsMapper.getOpenDoorSensorDetails(entity);

      expect(result.isOpen).toBeUndefined();
      expect(result.isOnline).toBe(false);
      expect(result.signalStrength).toBe(0);
    });
  });

  describe('getSirenDetailsDto', () => {
    it('maps siren data (battery, online, signalStrength)', () => {
      const entity: HomeDevice = baseDevice({
        deviceType: DeviceType.SIREN,
        deviceName: 'Hallway Siren',
        signalStrength: 25,
        battery: 90,
      });

      const result: SirenDetailsDto = DeviceDetailsMapper.getSirenDetailsDto(entity);

      expect(result).toEqual({
        type: DeviceType.SIREN,
        homeDeviceId: 'zig-1',
        name: 'Hallway Siren',
        signalStrength: 250,
        isOnline: true,
        battery: 90,
        id: 1,
      });
      expect(calculatePercentage).toHaveBeenCalledWith(0, 255, 25);
    });

    it('sets battery=undefined, offline, and signalStrength=0 when signalStrength is missing', () => {
      const entity: HomeDevice = baseDevice({ deviceType: DeviceType.SIREN });

      const result: SirenDetailsDto = DeviceDetailsMapper.getSirenDetailsDto(entity);

      expect(result.battery).toBeUndefined();
      expect(result.isOnline).toBe(false);
      expect(result.signalStrength).toBe(0);
      expect(calculatePercentage).not.toHaveBeenCalled();
    });
  });

  describe('getPilotDetailDto', () => {
    it('maps pilot data (battery, online, signalStrength)', () => {
      const entity: HomeDevice = baseDevice({
        deviceType: DeviceType.PILOT,
        deviceName: 'Remote 1',
        signalStrength: 12,
        battery: 77,
      });

      const result: PilotDetailsDto = DeviceDetailsMapper.getPilotDetailDto(entity);

      expect(result).toEqual({
        type: DeviceType.PILOT,
        homeDeviceId: 'zig-1',
        name: 'Remote 1',
        signalStrength: 120,
        isOnline: true,
        battery: 77,
        id: 1,
      });
      expect(calculatePercentage).toHaveBeenCalledWith(0, 255, 12);
    });

    it('sets offline, battery=undefined, and signalStrength=0 when data is missing', () => {
      const entity: HomeDevice = baseDevice({ deviceType: DeviceType.PILOT });

      const result: PilotDetailsDto = DeviceDetailsMapper.getPilotDetailDto(entity);

      expect(result.isOnline).toBe(false);
      expect(result.battery).toBeUndefined();
      expect(result.signalStrength).toBe(0);
      expect(calculatePercentage).not.toHaveBeenCalled();
    });
  });

  describe('toPetFeederDetailsDto', () => {
    it('maps feeder data (portions, size, online, signalStrength)', () => {
      const entity: HomeDevice = baseDevice({
        deviceType: DeviceType.PET_FEEDER,
        deviceName: 'Feeder A',
        signalStrength: 40,
        feederNumberOfPortions: 3,
        feederPortionSize: 20,
      });

      const result: PetFeederDetailsDto = DeviceDetailsMapper.toPetFeederDetailsDto(entity);

      expect(result).toEqual({
        type: DeviceType.PET_FEEDER,
        homeDeviceId: 'zig-1',
        name: 'Feeder A',
        signalStrength: 400,
        isOnline: true,
        id: 1,
        numberOfPortions: 3,
        portionSize: 20,
      });
      expect(calculatePercentage).toHaveBeenCalledWith(0, 255, 40);
    });

    it('sets offline, signalStrength=0, and leaves portions/size undefined when data is missing', () => {
      const entity: HomeDevice = baseDevice({
        deviceType: DeviceType.PET_FEEDER,
        signalStrength: null,
        feederNumberOfPortions: null,
        feederPortionSize: null,
      });

      const result: PetFeederDetailsDto = DeviceDetailsMapper.toPetFeederDetailsDto(entity);

      expect(result.isOnline).toBe(false);
      expect(result.signalStrength).toBe(0);
      expect(result.numberOfPortions).toBeNull();
      expect(result.portionSize).toBeNull();
      expect(calculatePercentage).not.toHaveBeenCalled();
    });
  });
});
