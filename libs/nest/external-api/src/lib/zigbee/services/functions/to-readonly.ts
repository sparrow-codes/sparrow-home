import { Expose } from '@sparrow-server/shared';

import { ReadonlyField } from '../../model/device-profile';
import { has } from './has-access/has-access';

export function mapExposesToReadonly(exposes: Expose[]): ReadonlyField[] {
  const out: ReadonlyField[] = [];

  const visit = (ex: Expose, path: string[] = [], endpoint?: string) => {
    const access = ex.access ?? 0;
    const appearsInState = has(access, 1);
    const supportsGet = has(access, 4);

    if (Array.isArray(ex.features) && ex.features.length) {
      ex.features.forEach((f) =>
        visit(
          { endpoint: ex.endpoint ?? f.endpoint, ...f },
          path.concat(ex.property ?? ex.name ?? []),
          ex.endpoint ?? endpoint
        )
      );
      return;
    }

    const prop = ex.property ?? ex.name;
    if (!prop) return;

    const key = [...path.filter(Boolean), prop].join('.');
    const readonlyField: Partial<ReadonlyField> = {
      key,
      path: [...path.filter(Boolean), prop],
      appearsInState,
      supportsGet,
    };

    if (ex.type === 'numeric') {
      const range =
        ex.value_min != null || ex.value_max != null || ex.value_step != null
          ? { min: ex.value_min, max: ex.value_max, step: ex.value_step }
          : undefined;

      out.push({
        ...readonlyField,
        key,
        path: [...path.filter(Boolean), prop],
        type: 'number',
        unit: ex.unit,
        range,
        appearsInState,
        supportsGet,
      });
    } else if (ex.type === 'enum') {
      out.push({
        key,
        path: [...path.filter(Boolean), prop],
        type: 'enum',
        enumValues: ex.values ?? [],
        appearsInState,
        supportsGet,
      });
    } else if (ex.type === 'binary' || ex.type === 'switch') {
      // rzadkie, ale bywa read-only binary (np. przyciski action)
      out.push({
        key,
        path: [...path.filter(Boolean), prop],
        type: 'boolean',
        appearsInState,
        supportsGet,
      });
    } else {
      out.push({
        key,
        path: [...path.filter(Boolean), prop],
        type: 'string',
        appearsInState,
        supportsGet,
      });
    }
  };

  exposes.forEach((ex) => visit(ex));
  return out;
}
