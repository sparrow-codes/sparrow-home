import { DeviceAction, DeviceProfile } from '@sparrow-server/external-api';
import { DeviceActionDto } from '@sparrow-server/shared';

export function toActions(deviceProfile: DeviceProfile): DeviceActionDto[] {
  const actions: DeviceAction[] = deviceProfile.actions ?? [];
  const state: Record<string, unknown> = deviceProfile.state ?? {};

  return actions.map<Readonly<DeviceActionDto>>((action) => {
    const raw: unknown = state[action.key as keyof typeof state];
    const currentValue: unknown =
      action.type === 'enum' && Array.isArray(action.enumValues) && !action.enumValues.includes(raw as string)
        ? undefined
        : raw;

    return {
      key: action.key,
      range: action.range,
      unit: action.unit,
      type: action.type,
      enumValues: action.enumValues,
      currentValue,
    };
  });
}
