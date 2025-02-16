export interface HeatPump {
  deviceGuid: string;
  outdoorNow: number;
  waterPressure: string;
  waterTank: WaterTank | null;
  heatTank: HeatTank | null;
}

export interface WaterTank {
  operationStatus: number;
  currentTemperature?: number;
  heatMax: number;
  heatMin: number;
  heatSet: number;
}

export interface HeatTank {
  operationStatus: number;
  currentTemperature: number | null;
  heatSet: number;
}
