import { DeviceJoined } from '@sparrow-server/shared';

import { DeviceProfile } from '../../model/device-profile';
import { has } from './has-access/has-access';
import { mapExposesToActions } from './to-actions/to-actions';
import { mapExposesToReadonly } from './to-readonly';

export function toDevice(from: DeviceJoined): DeviceProfile {
  return {
    deviceIdentity: {
      ieee: from.ieee_address,
      friendlyName: from.friendly_name,
    },
    deviceDefinition: {
      description: from.definition?.description,
      model: from.definition?.model,
      vendor: from.definition?.vendor,
    },
    actions: mapExposesToActions(from.definition?.exposes ?? []),
    readonlyFields: mapExposesToReadonly(from.definition?.exposes?.filter((exp) => !has(exp.access ?? 0, 2)) ?? []),
    state: {},
  };
}
