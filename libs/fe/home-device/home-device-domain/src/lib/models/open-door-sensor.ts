import { HomeDevice } from '.';

export interface OpenDoorSensor extends HomeDevice {
  battery?: number;
  isOpen?: boolean;
  lastOpened?: Date;
}
