import { CommonModule } from '@angular/common';
import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { DeviceType } from '@sparrow-home/tuya-device-domain';

import { deviceTypeDictionary } from '../../dictionary/device-type-dictionary';

@Component({
  selector: 'sp-device-type',
  imports: [CommonModule],
  templateUrl: './device-type.component.html',
  styleUrl: './device-type.component.css',
})
export class DeviceTypeComponent {
  public readonly deviceType: InputSignal<DeviceType> = input.required();
  protected readonly label: Signal<string | undefined> = computed(() => deviceTypeDictionary.get(this.deviceType()));
  protected readonly deviceTypes: typeof DeviceType = DeviceType;
}
