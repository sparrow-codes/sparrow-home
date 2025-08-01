import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DeviceType } from '@sparrow-home/core';
import {
  DeviceFacadeService,
  HomeDevice,
  OpenDoorSensor,
  Siren,
  SwitchDevice,
  TemperatureSensor,
} from '@sparrow-home/home-device-domain';
import { BatteryStatusComponent, PageTitleComponent, sparrowFadeIn } from '@sparrow-home/ui';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Dialog } from 'primeng/dialog';
import { Divider } from 'primeng/divider';
import { InputText } from 'primeng/inputtext';
import { ToggleButton } from 'primeng/togglebutton';
import { filter, first, map, tap } from 'rxjs';

import { DeviceTypeComponent } from '../../components/device-type/device-type.component';
import { OpenDoorSensorDetailsComponent } from '../../components/open-door-sensor-details/open-door-sensor-details.component';
import { SignalStrengthComponent } from '../../components/signal-strength/signal-strength.component';
import { TemperatureSensorDetailsComponent } from '../../components/temperature-sensor-details/temperature-sensor-details.component';

@Component({
  selector: 'sp-device-device-details',
  imports: [
    CommonModule,
    PageTitleComponent,
    DeviceTypeComponent,
    SignalStrengthComponent,
    TemperatureSensorDetailsComponent,
    OpenDoorSensorDetailsComponent,
    BatteryStatusComponent,
    ToggleButton,
    FormsModule,
    Button,
    Divider,
    Card,
    Dialog,
    InputText,
  ],
  templateUrl: './device-details.component.html',
  animations: [sparrowFadeIn],
})
export class DeviceDetailsComponent implements OnInit {
  private id?: number;

  private readonly _facadeService: DeviceFacadeService = inject(DeviceFacadeService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  protected readonly showEditDialog: WritableSignal<boolean> = signal(false);
  protected readonly deviceDetails: Signal<HomeDevice | null> = this._facadeService.homeDeviceDetails;
  protected readonly switchDevice: Signal<SwitchDevice | null> = computed(() => {
    if (this.deviceDetails() && this.deviceDetails()?.type === DeviceType.POWER_PLUG) {
      return this.deviceDetails() as SwitchDevice;
    } else {
      return null;
    }
  });
  protected readonly temperatureSensor: Signal<TemperatureSensor | null> = computed(() => {
    if (this.deviceDetails() && this.deviceDetails()?.type === DeviceType.TEMPERATURE_SENSOR) {
      return this.deviceDetails() as TemperatureSensor;
    } else {
      return null;
    }
  });
  protected readonly openDoorSensor: Signal<OpenDoorSensor | null> = computed(() => {
    if (this.deviceDetails() && this.deviceDetails()?.type === DeviceType.OPEN_DOOR_SENSOR) {
      return this.deviceDetails() as OpenDoorSensor;
    } else {
      return null;
    }
  });

  protected readonly siren: Signal<Siren | null> = computed(() => {
    if (this.deviceDetails() && this.deviceDetails()?.type === DeviceType.SIREN) {
      return this.deviceDetails() as Siren;
    } else {
      return null;
    }
  });
  protected readonly deviceType: typeof DeviceType = DeviceType;

  public ngOnInit(): void {
    this._activatedRoute.paramMap
      .pipe(
        first(),
        map((params) => params.get('id')),
        filter((id) => id !== null),
        tap({
          next: (id: string) => {
            this.id = Number(id);
            this._facadeService.fetchDeviceDetailsById(Number(id));
          },
        })
      )
      .subscribe();
  }

  protected onLscSwitchChange(value: boolean): void {
    if (this.id) {
      this._facadeService.setLscSwitchOperationStatus(this.id, value);
    }
  }

  protected onDeviceDelete(id: number, name: string): void {
    this._facadeService.deleteDevice(id, name);
  }

  protected onDeviceNameChange(id: number, value: string): void {
    this._facadeService.changeDeviceName(id, value);
    this.showEditDialog.set(false);
  }
}
