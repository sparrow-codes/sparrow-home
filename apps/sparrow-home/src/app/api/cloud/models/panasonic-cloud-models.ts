export interface HeatPump {
  deiceStatus: number;
  operationStatus: number;
  modelSeriesSelection: number;
  multiOdConnection: number;
  specialStatus: SpecialStatu[];
  waterPressure: string;
  cnCntErrorStatus: number;
  zoneStatus: ZoneStatu[];
  outdoorNow: number;
  operationMode: number;
  holidayTimer: number;
  powerful: number;
  electricAnode: number;
  deviceGuid: string;
  bivalent: number;
  tankStatus: TankStatus[];
  informationMessage: number;
  pumpDuty: number;
  quietMode: number;
  forceHeater: number;
  tank: number;
  forceDHW: number;
  pendingUser: number;
  direction: number;
}

export interface SpecialStatu {
  specialMode: number;
  operationStatus: number;
}

export interface ZoneStatu {
  operationStatus: number;
  ecoHeat: number;
  coolMin?: number;
  heatMin?: number;
  comfortCool: number;
  temparatureNow?: number;
  coolSet: number;
  zoneId: number;
  comfortHeat: number;
  heatMax?: number;
  coolMax?: number;
  ecoCool: number;
  heatSet: number;
}

export interface TankStatus {
  operationStatus: number;
  temparatureNow: number;
  heatMax: number;
  heatMin: number;
  heatSet: number;
}
