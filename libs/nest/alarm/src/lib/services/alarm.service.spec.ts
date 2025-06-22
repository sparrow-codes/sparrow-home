import { DeviceType, HomeDevice } from '@sparrow-server/entities';
import { DeviceResponse, OpenDoorSensorDetails } from '@sparrow-server/external-api';

import { AlarmService } from './alarm.service';

const createMockSensor: (overrides?: Partial<HomeDevice>) => HomeDevice = (overrides: Partial<HomeDevice> = {}) =>
  ({
    id: 1,
    deviceName: 'Drzwi balkonowe',
    zigbeeDeviceId: 'abc-123',
    deviceType: DeviceType.OPEN_DOOR_SENSOR,
    isOpen: false,
    ...overrides,
  } as HomeDevice);

describe('AlarmService (unit methods)', () => {
  let service: AlarmService;

  beforeEach(() => {
    service = Object.create(AlarmService.prototype);
    service['_ignoredDevices'] = new Set<string>(['abc-123']);
  });

  it('_shouldIgnoreSensor returns true if sensor is in ignoredDevices', () => {
    const sensor: HomeDevice = createMockSensor();
    const result: boolean = service['_shouldIgnoreSensor'](sensor);
    expect(result).toBe(true);
  });

  it('_shouldIgnoreSensor returns false if sensor is not ignored', () => {
    service['_ignoredDevices'] = new Set<string>();
    const sensor: HomeDevice = createMockSensor();
    const result: boolean = service['_shouldIgnoreSensor'](sensor);
    expect(result).toBe(false);
  });

  it('_isOpenDoorTriggered returns true if door is open and alarm is active', () => {
    const sensor: HomeDevice = createMockSensor();
    const response: DeviceResponse<OpenDoorSensorDetails> = {
      deviceId: 'abc-123',
      payload: { contact: false } as never,
    };
    const result: boolean = service['_isOpenDoorTriggered'](sensor, response, true);
    expect(result).toBe(true);
  });

  it('_isOpenDoorTriggered returns false if door is closed', () => {
    const sensor: HomeDevice = createMockSensor();
    const response: DeviceResponse<OpenDoorSensorDetails> = {
      deviceId: 'abc-123',
      payload: { contact: true } as never,
    };
    const result: boolean = service['_isOpenDoorTriggered'](sensor, response, true);
    expect(result).toBe(false);
  });

  it('_isOpenDoorTriggered returns false if alarm is off', () => {
    const sensor: HomeDevice = createMockSensor();
    const response: DeviceResponse<OpenDoorSensorDetails> = {
      deviceId: 'abc-123',
      payload: { contact: false } as never,
    };
    const result: boolean = service['_isOpenDoorTriggered'](sensor, response, false);
    expect(result).toBe(false);
  });
});
