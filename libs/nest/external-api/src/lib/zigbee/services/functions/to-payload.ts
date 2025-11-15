import { DeviceAction } from '../../model';

export function toPayload(action: DeviceAction, value: unknown): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  const cur: Record<string, unknown> = payload;
  const segs: string[] = action.path;
  segs.forEach((k, idx) => {
    if (idx === segs.length - 1) cur[k] = value;
    else {
      cur[k] = cur[k] ?? {};
    }
  });
  return payload;
}
