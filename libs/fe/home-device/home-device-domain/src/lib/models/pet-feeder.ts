import { HomeDevice } from './home-device';

export interface PetFeeder extends HomeDevice {
  numberOfPortions: number;
  portionSize: number;
}
