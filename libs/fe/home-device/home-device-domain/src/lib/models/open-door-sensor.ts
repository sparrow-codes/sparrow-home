import { HomeDevice } from '.';

export interface OpenDoorSensor extends HomeDevice {
  isOpen?: boolean;
  lastOpened?: Date;
}
