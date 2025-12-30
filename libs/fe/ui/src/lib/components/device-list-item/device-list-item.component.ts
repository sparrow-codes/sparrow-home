import { CommonModule } from '@angular/common';
import { Component, computed, input, InputSignal, output, OutputEmitterRef, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DeviceAction, HomeDevice, HumanizePipe } from '@sparrow-home/utils';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';

import { deviceTypeDictionary } from '../../dictionary';
import { DeviceActionComponent } from '../device-action/device-action.component';
import { DeviceTypeComponent } from '../device-type/device-type.component';

@Component({
  selector: 'sp-device-list-item',
  imports: [
    CommonModule,
    DeviceTypeComponent,
    RouterLink,
    Card,
    DeviceTypeComponent,
    DeviceActionComponent,
    TranslatePipe,
    HumanizePipe,
    Tag,
  ],
  templateUrl: './device-list-item.component.html',
})
export class DeviceListItemComponent {
  public readonly device: InputSignal<HomeDevice> = input.required();
  public readonly deviceEvent: OutputEmitterRef<Record<string, unknown>> = output();
  public readonly disableRouting: InputSignal<boolean> = input(false);

  protected readonly mainAction: Signal<DeviceAction | null> = computed(() => {
    const mainActionKey: string | null = this.device().mainActionKey;

    if (mainActionKey) {
      return this.device().actions.find((action) => action.key === mainActionKey) ?? null;
    }

    return null;
  });
  protected readonly label: Signal<string | undefined> = computed(() => {
    const mainParamKey: string | null = this.device().mainParamKey;

    if (mainParamKey) {
      return `${this.device().params[mainParamKey]}`;
    }

    return deviceTypeDictionary.get(this.device().type);
  });
  protected showTag: Signal<boolean> = computed(() => !!this.device().mainParamKey);
}
