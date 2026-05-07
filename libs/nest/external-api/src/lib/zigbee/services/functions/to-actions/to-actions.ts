import { Expose } from '@sparrow-server/shared';

import { DeviceAction, Exposed } from '../../../model/device-profile';
import { has } from '../has-access/has-access';

export function mapExposesToActions(exposes: Expose[]): DeviceAction[] {
  const out: DeviceAction[] = [];

  const map = (ex: Expose, path: string[] = []): void => {
    const access: number = ex.access ?? 0;
    const readable: boolean = has(access, 1);
    const supportsGet: boolean = has(access, 4);
    const writable: boolean = has(ex.access ?? 0, 2);
    const appearsInState: boolean = readable;
    const prop: string = ex.property ?? (ex.name as string);

    if (Array.isArray(ex.features) && ex.features.length) {
      ex.features.forEach((feature) => map(feature));
    }

    if (!writable) {
      return;
    }

    const devicePath: string[] = [...path.filter(Boolean), prop];

    const exposed: Exposed = {
      key: devicePath.join('.'),
      appearsInState,
      path: devicePath,
      supportsGet,
    };

    switch (ex.type) {
      case 'binary':
      case 'switch': {
        const enumValues = [ex['value_on'] ?? 'ON', ex['value_off'] ?? 'OFF'] as string[];
        out.push({
          ...exposed,
          type: 'boolean',
          writable: true,
          readable,
          enumValues,
          unit: ex.unit,
        });
        break;
      }
      case 'numeric': {
        const range =
          ex.value_min != null || ex.value_max != null || ex.value_step != null
            ? { min: ex.value_min, max: ex.value_max, step: ex.value_step }
            : undefined;
        out.push({
          ...exposed,
          type: 'number',
          writable: true,
          readable,
          unit: ex.unit,
          range,
        });
        break;
      }
      case 'enum': {
        out.push({
          ...exposed,
          type: 'enum',
          writable: true,
          readable,
          enumValues: ex.values as ('ON' | 'OFF' | 'TOGGLE')[],
        });
        break;
      }
      default: {
        out.push({
          ...exposed,
          type: 'unknown',
          writable: true,
          readable,
        });
      }
    }
  };

  exposes.forEach((ex) => map(ex));
  return out;
}
