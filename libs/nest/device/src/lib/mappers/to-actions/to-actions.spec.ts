import { DeviceProfile } from '@sparrow-server/external-api';
import { DeviceActionDto } from '@sparrow-server/shared';

import { toActions } from './to-actions';

describe('toActions', () => {
  function prepareDeviceProfile(profile?: Partial<DeviceProfile>): DeviceProfile {
    return {
      actions: [],
      deviceDefinition: {},
      deviceIdentity: {
        ieee: '',
        friendlyName: '',
      },
      readonlyFields: [],
      state: {},
      ...profile,
    };
  }

  it('returns empty array when no actions are defined', () => {
    const profile: DeviceProfile = prepareDeviceProfile({ actions: [], state: { linkquality: 10 } as never });
    const deviceActionsDtos: DeviceActionDto[] = toActions(profile);
    expect(deviceActionsDtos).toEqual([]);
  });

  it('preserves range, unit, type and enumValues', () => {
    const profile: DeviceProfile = prepareDeviceProfile({
      state: { linkquality: 1, dimmer: 75 },
      actions: [
        {
          key: 'dimmer',
          range: [0, 100],
          unit: '%',
          type: 'number',
          writable: true,
          readable: false,
          appearsInState: false,
          supportsGet: false,
          path: [],
        },
      ],
    });
    const deviceActionsDtos: DeviceActionDto[] = toActions(profile);
    expect(deviceActionsDtos[0]).toEqual({
      key: 'dimmer',
      range: [0, 100],
      unit: '%',
      type: 'number',
      enumValues: undefined,
      currentValue: 75,
    });
  });
});
