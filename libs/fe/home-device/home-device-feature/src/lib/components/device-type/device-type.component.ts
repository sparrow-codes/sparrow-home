import { CommonModule } from '@angular/common';
import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { bootstrapPlugin, bootstrapThermometerHalf } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { DeviceType } from '@sparrow-home/home-device-domain';

import { deviceTypeDictionary } from '../../dictionary/device-type-dictionary';

@Component({
  selector: 'sp-device-type',
  imports: [CommonModule, NgIcon],
  templateUrl: './device-type.component.html',
  styleUrl: './device-type.component.css',
  providers: [provideIcons({ bootstrapPlugin, bootstrapThermometerHalf })],
})
export class DeviceTypeComponent {
  public readonly deviceType: InputSignal<DeviceType> = input.required();
  public readonly fullLabel: InputSignal<boolean> = input(true);
  protected readonly label: Signal<string | undefined> = computed(() => deviceTypeDictionary.get(this.deviceType()));
  protected readonly deviceTypes: typeof DeviceType = DeviceType;
}
