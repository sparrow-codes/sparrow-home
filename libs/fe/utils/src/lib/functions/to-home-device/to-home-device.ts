import { HomeDeviceDetailsDtoApiModel } from '@sparrow-home/api';

import { HomeDevice } from '../../model';
import { toDeviceAction } from '../to-device-action/to-device-action';

export function toHomeDevice(device: HomeDeviceDetailsDtoApiModel): HomeDevice {
  return {
    id: device.id,
    homeDeviceId: device.homeDeviceId,
    name: device.name,
    type: device.type,
    signalStrength: device.signalStrength,
    isOnline: device.isOnline,
    battery: device.battery,
    model: device.model,
    vendor: device.vendor,
    description: device.description,
    params: device.params,
    actions: device.actions.map(toDeviceAction),
    mainActionKey: device.mainActionKey,
    mainParamKey: device.mainParamKey,
    isOnMainPage: Boolean(device.isOnMainPage),
  };
}
