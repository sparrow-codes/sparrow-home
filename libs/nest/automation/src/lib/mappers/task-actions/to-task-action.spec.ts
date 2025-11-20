import { DeviceProfile } from '@sparrow-server/external-api';
import { ActionJob } from '@sparrow-server/entities';
import { DeviceActionDto } from '@sparrow-server/shared';
import { toTaskAction } from './to-task-action';

describe('toTaskAction', () => {
  const deviceID: string = 'zig-1';

  it('should map job action to device profile', () => {
    const profile: DeviceProfile = prepareDeviceProfile();
    const action: ActionJob = prepareAction({ switch: 'on' });

    const dto: DeviceActionDto | null = toTaskAction({ profile, action });

    expect(dto?.key).toBe('switch');
    expect(dto?.range?.min).toBe(0);
    expect(dto?.range?.max).toBe(100);
    expect(dto?.type).toBe('number');
    expect(dto?.currentValue).toBe('on');
    expect(dto?.unit).toBe('$');
    expect(dto?.enumValues).toStrictEqual(['on', 'off']);
  });

  it('should return null if no action found', () => {
    const profile: DeviceProfile = prepareDeviceProfile();
    const action: ActionJob = prepareAction({ test: 'on' });

    expect(toTaskAction({ profile, action })).toBeNull();
  });

  it('should return null if payload can`t be parsed', () => {
    const profile: DeviceProfile = prepareDeviceProfile();
    const action: ActionJob = prepareAction('2221' as never);

    expect(toTaskAction({ profile, action })).toBeNull();
  });

  it('should return null if payload is undefined', () => {
    const profile: DeviceProfile = prepareDeviceProfile();
    const action: ActionJob = prepareAction(undefined as never);

    expect(toTaskAction({ profile, action })).toBeNull();
  });

  it('should return null if payload is empty object', () => {
    const profile: DeviceProfile = prepareDeviceProfile();
    const action: ActionJob = prepareAction({});

    expect(toTaskAction({ profile, action })).toBeNull();
  });

  function prepareAction(payload: Record<string, unknown>): ActionJob {
    return {
      assignedDeviceId: deviceID,
      executionTime: new Date(),
      id: 0,
      payload,
      daysOfWeek: [1, 2],
      task: null as never,
    };
  }

  function prepareDeviceProfile(): DeviceProfile {
    return {
      actions: [
        {
          type: 'number',
          writable: true,
          readable: true,
          key: 'switch',
          appearsInState: true,
          supportsGet: false,
          unit: '$',
          range: {
            min: 0,
            max: 100,
          },
          path: ['/set/switch'],
          enumValues: ['on', 'off'],
        },
        {
          type: 'boolean',
          writable: true,
          readable: true,
          key: 'turn',
          appearsInState: true,
          supportsGet: false,
          path: ['/set/turn'],
        },
      ],
      deviceDefinition: {},
      deviceIdentity: {
        ieee: '',
        friendlyName: deviceID,
      },
      readonlyFields: [],
      state: {
        switch: 'on',
      },
    };
  }
});
