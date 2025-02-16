import { GetHeatPumpDetailsResponseApiModel } from '@sparrow-home/api';

import { HeatPump } from '../models/heat-pump';

export abstract class HeatPumpMapper {
  public static map(response: GetHeatPumpDetailsResponseApiModel): HeatPump {
    return {
      deviceGuid: response.deviceGuid,
      outdoorNow: response.outdoorNow,
      waterPressure: response.waterPressure,
      waterTank: response.tankStatus && {
        currentTemperature: response.tankStatus?.temparatureNow,
        heatMax: response.tankStatus?.heatMax,
        heatMin: response.tankStatus?.heatMin,
        heatSet: response.tankStatus?.heatSet,
        operationStatus: response.tankStatus?.operationStatus,
      },
      heatTank: response.zoneStatus && {
        currentTemperature: response.zoneStatus.temparatureNow,
        heatSet: response.zoneStatus.heatSet,
        operationStatus: response.zoneStatus.operationStatus,
      },
    };
  }
}
