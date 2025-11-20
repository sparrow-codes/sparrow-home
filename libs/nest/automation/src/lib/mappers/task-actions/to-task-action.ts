import { DeviceActionDto } from '@sparrow-server/shared';
import { DeviceAction, DeviceProfile } from '@sparrow-server/external-api';
import { ActionJob } from '@sparrow-server/entities';
import { Logger } from '@nestjs/common';

interface ToTaskActionParams {
  profile: DeviceProfile;
  action: ActionJob;
}

export function toTaskAction({ profile, action }: ToTaskActionParams): DeviceActionDto | null {
  let key: string;

  try {
    key = Object.keys(action.payload)[0];
  } catch (error) {
    Logger.error('Invalid payload: ' + action.payload);
    return null;
  }

  const actionProfile: DeviceAction | undefined = profile.actions.find((a) => a.key === key);

  if (!actionProfile) {
    Logger.error('Action not found: ' + key);
    return null;
  }

  return {
    type: actionProfile.type,
    key: actionProfile.key,
    range: actionProfile.range,
    unit: actionProfile.unit,
    enumValues: actionProfile.enumValues,
    currentValue: action.payload[key],
  };
}
