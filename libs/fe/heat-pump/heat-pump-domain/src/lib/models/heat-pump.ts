export interface HeatPump {
  deviceGuid: string;
  outdoorNow: number;
  waterPressure: string;
  waterTank?: WaterTank;
  heatTank?: HeatTank;
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
  currentTemperature?: number;
  heatSet: number;
}
