import { HomeDevice } from '@sparrow-server/entities';
import { DeviceProfile, ReadonlyField } from '@sparrow-server/external-api';

import { HomeDeviceDetailsDto } from '../models/home-device-details-dto';
import { toActions } from './to-actions/to-actions';
import { toSignalStrength } from './to-signal-strength/to-signal-strength';

export class DeviceDetailsMapper {
  private static readonly _COMMON_PARAMS: string[] = ['battery', 'linkquality', 'update', 'battery_low'];

  public static toDeviceDetails(entity: HomeDevice, deviceProfile: DeviceProfile): HomeDeviceDetailsDto {
    const linkQuality: number = (deviceProfile.state['linkquality'] as number) ?? 0;

    return {
      id: entity.id,
      type: entity.deviceType,
      homeDeviceId: entity.zigbeeDeviceId,
      name: entity.deviceName,
      signalStrength: toSignalStrength(linkQuality),
      isOnline: linkQuality > 0,
      battery: (deviceProfile.state['battery'] as number) ?? null,
      model: deviceProfile.deviceDefinition.model ?? '',
      vendor: deviceProfile.deviceDefinition.vendor ?? '',
      description: deviceProfile.deviceDefinition.description ?? '',
      params: this._toParams(deviceProfile),
      actions: toActions(deviceProfile),
      mainActionKey: entity.mainActionKey,
      mainParamKey: entity.mainParamKey,
      isOnMainPage: entity.isOnMainPage,
    };
  }

  private static _toParams(deviceProfile: DeviceProfile): Record<string, string> {
    const params: Record<string, string> = {};

    for (const param of Object.keys(deviceProfile.state)) {
      const readonlyField: ReadonlyField | undefined = deviceProfile.readonlyFields.find(
        (field) => field.key === param
      );

      if (!this._COMMON_PARAMS.includes(param) && !deviceProfile.actions.find((action) => action.key === param)) {
        params[param] =
          deviceProfile.state[param] !== undefined
            ? deviceProfile.state[param]?.toString() + (readonlyField?.unit ?? '')
            : '';
      }
    }

    return params;
  }
}
