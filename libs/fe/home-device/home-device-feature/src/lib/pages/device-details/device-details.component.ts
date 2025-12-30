import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, InputSignal, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DeviceFacadeService } from '@sparrow-home/home-device-domain';
import {
  BatteryStatusComponent,
  ConfirmationDialogComponent,
  ConfirmationDialogData,
  DeviceActionComponent,
  DeviceTypeComponent,
  PageTitleComponent,
} from '@sparrow-home/ui';
import { DeviceType, HomeDevice, humanize } from '@sparrow-home/utils';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { Dialog } from 'primeng/dialog';
import { Divider } from 'primeng/divider';
import { DialogService } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { filter, Observable, take } from 'rxjs';

import { DeviceParamComponent } from '../../components/device-param/device-param.component';
import { SignalStrengthComponent } from '../../components/signal-strength/signal-strength.component';

@Component({
  selector: 'sp-device-device-details',
  imports: [
    CommonModule,
    PageTitleComponent,
    DeviceTypeComponent,
    SignalStrengthComponent,
    BatteryStatusComponent,
    FormsModule,
    Button,
    Divider,
    Card,
    Dialog,
    InputText,
    DeviceParamComponent,
    DeviceActionComponent,
    Checkbox,
    TranslatePipe,
    Skeleton,
    FloatLabel,
    Select,
  ],
  templateUrl: './device-details.component.html',
})
export class DeviceDetailsComponent implements OnInit {
  public readonly id: InputSignal<string | null> = input<string | null>(null);

  private readonly _facadeService: DeviceFacadeService = inject(DeviceFacadeService);
  private readonly _translateService: TranslateService = inject(TranslateService);
  private readonly _dialogService: DialogService = inject(DialogService);

  protected readonly isLoading$: Observable<boolean> = this._facadeService.isLoading$;
  protected readonly isRefreshing$: Observable<boolean> = this._facadeService.isRefreshing$;
  protected readonly showEditDialog: WritableSignal<boolean> = signal(false);
  protected readonly deviceDetails: Signal<HomeDevice | null> = this._facadeService.homeDeviceDetails;
  protected readonly params: Signal<[string, string][]> = computed(() =>
    Object.entries(this.deviceDetails()?.params ?? {})
  );
  protected readonly deviceType: typeof DeviceType = DeviceType;
  protected readonly mainActionKey: Signal<string | null> = computed(() => this.deviceDetails()?.mainActionKey ?? null);
  protected readonly mainParamKey: Signal<string | null> = computed(() => this.deviceDetails()?.mainParamKey ?? null);
  protected readonly isOnMainPage: Signal<boolean> = computed(() => this.deviceDetails()?.isOnMainPage ?? false);
  protected readonly mainActions: Signal<{ value: string; label: string }[]> = computed(
    () =>
      this.deviceDetails()
        ?.actions?.filter(
          (action) => action.type === 'boolean' || (action.type === 'enum' && action.enumValues.length === 1)
        )
        .map((action) => ({ value: action.key, label: humanize(action.key) })) ?? []
  );

  protected readonly mainParams: Signal<{ value: string; label: string }[]> = computed(
    () => this.params()?.map(([value]) => ({ value: value, label: humanize(value) })) ?? []
  );

  public ngOnInit(): void {
    if (this.id()) {
      this._facadeService.fetchDeviceDetailsById(Number(this.id()));
    }
  }

  protected onDeviceDelete(id: number, name: string): void {
    this._dialogService
      .open(ConfirmationDialogComponent, {
        modal: true,
        header: this._translateService.instant('home.remove_device'),
        width: '90vw',
        data: {
          content: this._translateService.instant('home.remove_device_confirmation_content', { deviceName: name }),
        } as ConfirmationDialogData,
      })
      ?.onClose.pipe(
        take(1),
        filter((result) => !!result)
      )
      .subscribe(() => this._facadeService.deleteDevice(id));
  }

  protected onDeviceNameChange(id: number, value: string): void {
    this._facadeService.changeDeviceName(id, value);
    this.showEditDialog.set(false);
  }

  protected publishZigbeeEvent(deviceId: string, payload: Record<string, unknown>): void {
    this._facadeService.publishZigbeeEvent(deviceId, payload);
  }

  protected setMainAction(actionKey: string | null): void {
    this._facadeService.updateDeviceSettings(this.id() as string, {
      mainActionKey: actionKey,
      mainParamKey: this.mainParamKey(),
      isOnMainPage: this.isOnMainPage(),
    });
  }

  protected setMainParam(paramKey: string | null): void {
    this._facadeService.updateDeviceSettings(this.id() as string, {
      mainActionKey: this.mainActionKey(),
      mainParamKey: paramKey,
      isOnMainPage: this.isOnMainPage(),
    });
  }

  protected setIsOnMainPage(isOnMainPage: boolean): void {
    this._facadeService.updateDeviceSettings(this.id() as string, {
      mainActionKey: this.mainActionKey(),
      mainParamKey: this.mainParamKey(),
      isOnMainPage: isOnMainPage,
    });
  }
}
