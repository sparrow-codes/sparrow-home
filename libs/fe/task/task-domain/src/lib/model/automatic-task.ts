export interface AutomaticTask {
  id: number;
  name: string;
  isActive: boolean;
  startTime?: Date;
  endTime?: Date;
  homeDevices: number[];
}
