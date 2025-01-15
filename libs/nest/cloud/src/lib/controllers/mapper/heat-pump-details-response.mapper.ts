import { HeatPump } from '@sparrow-server/external-api';

import { GetHeatPumpDetailsResponse } from '../models/panasonic/get-heat-pump-details.response';

export class HeatPumpDetailsResponseMapper {
  public static map(heatPump: HeatPump): GetHeatPumpDetailsResponse {
    return {
      outdoorNow: heatPump.outdoorNow,
      tankStatus: heatPump.tankStatus[0],
      zoneStatus: heatPump.zoneStatus[0],
      waterPressure: heatPump.waterPressure,
      deviceGuid: heatPump.deviceGuid,
    };
  }
}
