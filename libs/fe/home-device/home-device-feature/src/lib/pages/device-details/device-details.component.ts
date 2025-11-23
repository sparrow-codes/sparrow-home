import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, InputSignal, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeviceFacadeService } from '@sparrow-home/home-device-domain';
import {
  BatteryStatusComponent,
  DeviceActionComponent,
  DeviceTypeComponent,
  PageTitleComponent,
  sparrowFadeIn,
} from '@sparrow-home/ui';
import { DeviceType, HomeDevice, HumanizePipe } from '@sparrow-home/utils';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { Dialog } from 'primeng/dialog';
import { Divider } from 'primeng/divider';
import { InputText } from 'primeng/inputtext';
import { RadioButton } from 'primeng/radiobutton';

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
    RadioButton,
    HumanizePipe,
    Checkbox,
  ],
  templateUrl: './device-details.component.html',
  animations: [sparrowFadeIn],
})
export class DeviceDetailsComponent implements OnInit {
  public readonly id: InputSignal<string | null> = input<string | null>(null);

  private readonly _facadeService: DeviceFacadeService = inject(DeviceFacadeService);

  protected readonly showEditDialog: WritableSignal<boolean> = signal(false);
  protected readonly deviceDetails: Signal<HomeDevice | null> = this._facadeService.homeDeviceDetails;
  protected readonly params: Signal<[string, string][]> = computed(() =>
    Object.entries(this.deviceDetails()?.params ?? {})
  );
  protected readonly deviceType: typeof DeviceType = DeviceType;
  protected mainActionKey: Signal<string | null> = computed(() => this.deviceDetails()?.mainActionKey ?? null);
  protected mainParamKey: Signal<string | null> = computed(() => this.deviceDetails()?.mainParamKey ?? null);
  protected isOnMainPage: Signal<boolean> = computed(() => this.deviceDetails()?.isOnMainPage ?? false);

  public ngOnInit(): void {
    if (this.id()) {
      this._facadeService.fetchDeviceDetailsById(Number(this.id()));
    }
  }

  protected onDeviceDelete(id: number, name: string): void {
    this._facadeService.deleteDevice(id, name);
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
