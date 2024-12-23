export interface SetOperationModeRequest {
  status: DeviceStatus[];
}

export interface DeviceStatus {
  deviceGuid: string;
  operationStatus: number;
  zoneStatus: DeviceZoneStatus[];
  tankStatus: DeviceTankStatus[];
  operationMode?: number;
}

export interface DeviceZoneStatus {
  zoneId: number;
  operationStatus: number;
}

export interface DeviceTankStatus {
  operationStatus: number;
}
