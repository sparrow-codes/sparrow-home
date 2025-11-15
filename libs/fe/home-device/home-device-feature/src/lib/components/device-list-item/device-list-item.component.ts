import { CommonModule } from '@angular/common';
import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeviceType } from '@sparrow-home/utils';
import { Card } from 'primeng/card';

import { deviceTypeDictionary } from '../../dictionary/device-type-dictionary';
import { DeviceTypeComponent } from '../device-type/device-type.component';

@Component({
  selector: 'sp-device-list-item',
  imports: [CommonModule, DeviceTypeComponent, RouterLink, Card],
  templateUrl: './device-list-item.component.html',
})
export class DeviceListItemComponent {
  public readonly deviceName: InputSignal<string> = input.required();
  public readonly deviceType: InputSignal<DeviceType> = input.required();
  public readonly deviceId: InputSignal<number> = input.required();

  protected readonly label: Signal<string | undefined> = computed(() => deviceTypeDictionary.get(this.deviceType()));
}
