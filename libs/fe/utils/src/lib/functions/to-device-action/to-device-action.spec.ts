import { DeviceActionDtoApiModel } from '@sparrow-home/api';

import { DeviceAction } from '../../model';
import { toDeviceAction } from './to-device-action';

describe('toDeviceAction', () => {
  it('should map all properties correctly from DeviceActionDtoApiModel to DeviceAction', () => {
    const input: DeviceActionDtoApiModel = {
      type: 'enum',
      key: 'power',
      enumValues: ['on', 'off'],
      range: null,
      unit: null,
      currentValue: 'on',
    };

    const result: DeviceAction = toDeviceAction(input);

    expect(result).toEqual({
      type: 'enum',
      key: 'power',
      enumValues: ['on', 'off'],
      range: null,
      unit: null,
      currentValue: 'on',
    });
  });

  it('should set enumValues to an empty array if it is null or undefined in the input', () => {
    const input: DeviceActionDtoApiModel = {
      type: 'number',
      key: 'brightness',
      enumValues: [],
      range: [0, 100],
      unit: '%',
      currentValue: '50',
    };

    const result: DeviceAction = toDeviceAction(input);

    expect(result.enumValues).toEqual([]);
  });

  it('should correctly handle null values for range and unit', () => {
    const input: DeviceActionDtoApiModel = {
      type: 'unknown',
      key: 'volume',
      enumValues: null,
      range: null,
      unit: null,
      currentValue: '30',
    };

    const result: DeviceAction = toDeviceAction(input);

    expect(result.range).toBeNull();
    expect(result.unit).toBeNull();
  });

  it('should correctly map currentValue from the input', () => {
    const input: DeviceActionDtoApiModel = {
      type: 'enum',
      key: 'mute',
      enumValues: ['on', 'off'],
      range: null,
      unit: null,
      currentValue: 'off',
    };

    const result: DeviceAction = toDeviceAction(input);

    expect(result.currentValue).toBe('off');
  });
});
