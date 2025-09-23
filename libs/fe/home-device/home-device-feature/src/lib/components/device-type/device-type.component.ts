import { CommonModule } from '@angular/common';
import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import {
  bootstrapBellFill,
  bootstrapBuildingFillGear,
  bootstrapDoorOpenFill,
  bootstrapPlugin,
  bootstrapThermometerHalf,
  bootstrapWifi,
} from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { DeviceType } from '@sparrow-home/utils';

import { deviceTypeDictionary } from '../../dictionary/device-type-dictionary';

@Component({
  selector: 'sp-device-type',
  imports: [CommonModule, NgIcon],
  templateUrl: './device-type.component.html',
  styleUrl: './device-type.component.css',
  providers: [
    provideIcons({
      bootstrapPlugin,
      bootstrapThermometerHalf,
      bootstrapDoorOpenFill,
      bootstrapBellFill,
      bootstrapWifi,
      bootstrapBuildingFillGear,
    }),
  ],
})
export class DeviceTypeComponent {
  public readonly deviceType: InputSignal<DeviceType> = input.required();
  public readonly fullLabel: InputSignal<boolean> = input(true);

  protected readonly label: Signal<string | undefined> = computed(() => deviceTypeDictionary.get(this.deviceType()));
  protected readonly deviceTypes: typeof DeviceType = DeviceType;
  protected readonly iconName: Signal<string> = computed(() => {
    switch (this.deviceType()) {
      case DeviceType.POWER_PLUG:
        return 'bootstrapPlugin';
      case DeviceType.TEMPERATURE_SENSOR:
        return 'bootstrapThermometerHalf';
      case DeviceType.OPEN_DOOR_SENSOR:
        return 'bootstrapDoorOpenFill';
      case DeviceType.SIREN:
        return 'bootstrapBellFill';
      case DeviceType.PILOT:
        return 'bootstrapWifi';
      case DeviceType.PET_FEEDER:
        return 'bootstrapBuildingFillGear';
      default:
        return '';
    }
  });
}
