import { SetOperationModeRequest } from '../models/set-operation-mode-request';
import { OperationModeMapper } from './operation-mode/operation-mode.mapper';

export class SetDeviceStatusRequestMapper {
  public static map(isWaterOn: boolean, isHeatOn: boolean, deviceGuid: string): SetOperationModeRequest {
    return {
      status: [
        {
          deviceGuid: deviceGuid,
          operationStatus: isWaterOn || isHeatOn ? 1 : 0,
          operationMode: OperationModeMapper.map(isWaterOn, isHeatOn),
          tankStatus: [{ operationStatus: isWaterOn ? 1 : 0 }],
          zoneStatus: [
            {
              zoneId: 1,
              operationStatus: isHeatOn ? 1 : 0,
            },
            {
              zoneId: 2,
              operationStatus: 0,
            },
          ],
        },
      ],
    };
  }
}
