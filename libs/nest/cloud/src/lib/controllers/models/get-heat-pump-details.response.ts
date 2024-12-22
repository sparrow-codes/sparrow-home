export class GetHeatPumpDetailsResponse {
  public deviceGuid: string;
  public outdoorNow: number;
  public waterPressure: string;
  public zoneStatus: { operationStatus: number; temparatureNow?: number; heatSet: number };
  public tankStatus: {
    operationStatus: number;
    temparatureNow: number;
    heatMax: number;
    heatMin: number;
    heatSet: number;
  };
}
