export interface GetHeatPumpDetailsResponse {
  deviceGuid: string;
  outdoorNow: number;
  waterPressure: string;
  zoneStatus?: ZoneStatus;
  tankStatus?: TankStatus;
}

export interface ZoneStatus {
  operationStatus: number;
  temparatureNow?: number;
  heatSet: number;
}

export interface TankStatus {
  operationStatus: number;
  temparatureNow: number;
  heatMax: number;
  heatMin: number;
  heatSet: number;
}
