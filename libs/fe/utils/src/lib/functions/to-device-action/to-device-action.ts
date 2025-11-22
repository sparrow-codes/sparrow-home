import { DeviceActionDtoApiModel } from '@sparrow-home/api';

import { DeviceAction } from '../../model';

export function toDeviceAction(action: DeviceActionDtoApiModel): DeviceAction {
  return {
    type: action.type,
    key: action.key,
    enumValues: action.enumValues?.filter((value) => !!value) ?? [],
    range: action.range,
    unit: action.unit,
    currentValue: action.currentValue,
  };
}
