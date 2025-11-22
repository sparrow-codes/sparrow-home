// device-details.mapper.spec.ts
import { HomeDevice } from '@sparrow-server/entities';
import type { DeviceAction, DeviceProfile, ReadonlyField } from '@sparrow-server/external-api';

import { calculatePercentage } from '../utils/calculate-percentage';
import { DeviceDetailsMapper } from './device-details-mapper';

const makeHomeDevice = (overrides?: Partial<HomeDevice>): HomeDevice =>
  Object.assign(new HomeDevice(), {
    id: 11,
    deviceType: 'OPEN_DOOR_SENSOR',
    zigbeeDeviceId: 'zig-1',
    deviceName: 'Front Door',
    ...overrides,
  });

const makeProfile = (overrides?: Partial<DeviceProfile>): DeviceProfile =>
  ({
    deviceIdentity: { friendlyName: 'zig-1' },
    deviceDefinition: { model: 'M1', vendor: 'Acme', description: 'Desc' },
    state: { linkquality: 120, battery: 90 },
    readonlyFields: [] as ReadonlyField[],
    actions: [] as DeviceAction[],
    ...overrides,
  } as DeviceProfile);

describe('DeviceDetailsMapper.toDeviceDetails', () => {
  it('maps base fields and computed flags', () => {
    const entity = makeHomeDevice({ mainActionKey: 'State', mainParamKey: 'linkquality' });
    const profile = makeProfile();
    const dto = DeviceDetailsMapper.toDeviceDetails(entity, profile);
    expect(dto).toMatchObject({
      id: 11,
      type: 'OPEN_DOOR_SENSOR',
      homeDeviceId: 'zig-1',
      name: 'Front Door',
      isOnline: true,
      battery: 90,
      model: 'M1',
      vendor: 'Acme',
      description: 'Desc',
      mainActionKey: 'State',
      mainParamKey: 'linkquality',
    });
    const expectedSignal = calculatePercentage(0, 255, 120);
    expect(dto.signalStrength).toBe(expectedSignal);
  });

  it('defaults model, vendor, description and battery when missing', () => {
    const entity = makeHomeDevice();
    const profile = makeProfile({
      deviceDefinition: {} as never,
      state: { linkquality: 1 } as never,
    });
    const dto = DeviceDetailsMapper.toDeviceDetails(entity, profile);
    expect(dto.model).toBe('');
    expect(dto.vendor).toBe('');
    expect(dto.description).toBe('');
    expect(dto.battery).toBeNull();
  });

  it('sets isOnline=false and signalStrength=0 when linkquality is 0 or missing', () => {
    const entity = makeHomeDevice();
    const p0 = makeProfile({ state: { linkquality: 0 } as never });
    const dto0 = DeviceDetailsMapper.toDeviceDetails(entity, p0);
    expect(dto0.isOnline).toBe(false);
    expect(dto0.signalStrength).toBe(0);

    const pu = makeProfile({ state: {} as never });
    const dtou = DeviceDetailsMapper.toDeviceDetails(entity, pu);
    expect(dtou.isOnline).toBe(false);
    expect(dtou.signalStrength).toBe(0);
  });

  it('includes params excluding common and action keys and appends units', () => {
    const entity = makeHomeDevice();
    const profile = makeProfile({
      state: {
        linkquality: 100,
        battery: 42,
        update: 'ignored',
        battery_low: true,
        temperature: 21.5,
        humidity: 55,
        mode: 'auto',
        level: undefined,
      },
      readonlyFields: [
        {
          key: 'temperature',
          unit: '°C',
          type: 'string',
          appearsInState: false,
          supportsGet: false,
          path: [],
        },
        {
          key: 'humidity',
          unit: '%',
          type: 'string',
          appearsInState: false,
          supportsGet: false,
          path: [],
        },
        {
          key: 'mode',
          unit: '',
          type: 'string',
          appearsInState: false,
          supportsGet: false,
          path: [],
        },
        {
          key: 'level',
          unit: '%',
          type: 'string',
          appearsInState: false,
          supportsGet: false,
          path: [],
        },
      ],
      actions: [{ key: 'mode' }] as never,
    });
    const dto = DeviceDetailsMapper.toDeviceDetails(entity, profile);
    expect(dto.params).toEqual({
      temperature: '21.5°C',
      humidity: '55%',
      level: '',
    });
    expect(dto.params['battery']).toBeUndefined();
    expect(dto.params['linkquality']).toBeUndefined();
    expect(dto.params['update']).toBeUndefined();
    expect(dto.params['battery_low']).toBeUndefined();
    expect(dto.params['mode']).toBeUndefined();
  });

  it('maps actions with currentValue from state', () => {
    const entity = makeHomeDevice();
    const profile = makeProfile({
      state: { linkquality: 80, fan_speed: 3, mode: 'cool' } as never,
      actions: [
        {
          key: 'fan_speed',
          range: [1, 5],
          unit: '',
          type: 'number',
          writable: true,
          readable: false,
          appearsInState: false,
          supportsGet: false,
          path: [],
        },
        {
          key: 'mode',
          enumValues: ['heat', 'cool', 'auto'],
          type: 'enum',
          writable: true,
          readable: false,
          appearsInState: false,
          supportsGet: false,
          path: [],
        },
      ],
    });
    const dto = DeviceDetailsMapper.toDeviceDetails(entity, profile);
    expect(dto.actions).toEqual([
      { key: 'fan_speed', range: [1, 5], unit: '', type: 'number', enumValues: undefined, currentValue: 3 },
      {
        key: 'mode',
        range: undefined,
        unit: undefined,
        type: 'enum',
        enumValues: ['heat', 'cool', 'auto'],
        currentValue: 'cool',
      },
    ]);
  });
});

describe('DeviceDetailsMapper._toActions', () => {
  describe('DeviceDetailsMapper._toParams', () => {
    it('omits common keys and action keys', () => {
      const profile = makeProfile({
        state: { linkquality: 1, battery: 10, update: 'x', battery_low: false, actionLike: 'y' } as never,
        actions: [{ key: 'actionLike' }] as never,
      });
      const res = DeviceDetailsMapper['_toParams'](profile);
      expect(Object.keys(res)).toHaveLength(0);
    });

    it('formats values with units and handles undefined as empty string', () => {
      const profile = makeProfile({
        state: { linkquality: 1, t: 12.3, p: undefined } as never,
        readonlyFields: [
          {
            key: 't',
            unit: '°C',
            type: 'string',
            appearsInState: false,
            supportsGet: false,
            path: [],
          },
          {
            key: 'p',
            unit: 'kPa',
            type: 'string',
            appearsInState: false,
            supportsGet: false,
            path: [],
          },
        ],
      });
      const res: Record<string, unknown> = DeviceDetailsMapper['_toParams'](profile);
      expect(res).toEqual({ t: '12.3°C', p: '' });
    });
  });
});
