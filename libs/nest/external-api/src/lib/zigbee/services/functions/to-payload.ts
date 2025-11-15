import { DeviceAction } from '../../model';

/**
 * Helper: z akcji i wartości tworzy poprawny payload JSON do publikacji na topic /set.
 * Np. dla action.key = "color.hue" i value=120 zbuduje { "color": { "hue": 120 } }.
 */
export function toPayload(action: DeviceAction, value: any): Record<string, any> {
  const payload: Record<string, any> = {};
  let cur: any = payload;
  const segs = action.path;
  segs.forEach((k, idx) => {
    if (idx === segs.length - 1) cur[k] = value;
    else {
      cur[k] = cur[k] ?? {};
      cur = cur[k];
    }
  });
  return payload;
}
