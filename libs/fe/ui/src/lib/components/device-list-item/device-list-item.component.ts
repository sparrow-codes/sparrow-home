import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, InputSignal, output, OutputEmitterRef, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DeviceAction, DeviceType, HomeDevice, HumanizePipe } from '@sparrow-home/utils';
import { Tag } from 'primeng/tag';

import { deviceTypeDictionary } from '../../dictionary';
import { DeviceActionComponent } from '../device-action/device-action.component';
import { DeviceTypeComponent } from '../device-type/device-type.component';

@Component({
  selector: 'sp-device-list-item',
  imports: [CommonModule, RouterLink, DeviceTypeComponent, DeviceActionComponent, TranslatePipe, HumanizePipe, Tag],
  templateUrl: './device-list-item.component.html',
})
export class DeviceListItemComponent {
  private readonly _translateService: TranslateService = inject(TranslateService);

  public readonly device: InputSignal<HomeDevice> = input.required();
  public readonly deviceEvent: OutputEmitterRef<Record<string, unknown>> = output();
  public readonly routing: InputSignal<string[] | undefined> = input();
  public readonly isLoading: InputSignal<boolean> = input(false);
  public readonly refreshingDevices: InputSignal<Set<string>> = input.required();

  protected readonly showFinishAnimation: Signal<boolean> = computed(() => {
    return this.refreshingDevices().has(this.device().homeDeviceId);
  });

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
      if (this.device().type === DeviceType.OPEN_DOOR_SENSOR && mainParamKey === 'contact') {
        return this.device().params[mainParamKey] === 'true'
          ? this._translateService.instant('ui.closed')
          : this._translateService.instant('ui.open');
      } else {
        return this.device().params[mainParamKey];
      }
    }

    return deviceTypeDictionary.get(this.device().type);
  });
  protected showTag: Signal<boolean> = computed(() => !!this.device().mainParamKey);

  protected onDeviceEvent(event: Record<string, unknown>): void {
    this.deviceEvent.emit(event);
  }
}
