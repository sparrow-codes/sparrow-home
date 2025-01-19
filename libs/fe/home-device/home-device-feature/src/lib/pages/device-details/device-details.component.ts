import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroAdjustmentsHorizontal, heroNoSymbol, heroTrash, heroWifi } from '@ng-icons/heroicons/outline';
import { heroCheckCircleSolid } from '@ng-icons/heroicons/solid';
import { DeviceFacadeService, DeviceType, HomeDevice, SwitchDevice } from '@sparrow-home/home-device-domain';
import { PageTitleComponent, sparrowFadeIn } from '@sparrow-home/ui';
import { filter, first, map, tap } from 'rxjs';

import { DeviceTypeComponent } from '../../components/device-type/device-type.component';
import { LcsSwitchManualControlComponent } from '../../components/manual-control/lcs-switch-manual-control/lcs-switch-manual-control.component';
import { SignalStrengthComponent } from '../../components/signal-strength/signal-strength.component';

@Component({
  selector: 'sp-device-device-details',
  imports: [
    CommonModule,
    PageTitleComponent,
    MatCard,
    MatCardContent,
    DeviceTypeComponent,
    MatDivider,
    NgIcon,
    LcsSwitchManualControlComponent,
    MatCardHeader,
    MatCardTitle,
    SignalStrengthComponent,
    MatCardActions,
    MatButton,
  ],
  templateUrl: './device-details.component.html',
  providers: [provideIcons({ heroNoSymbol, heroCheckCircleSolid, heroAdjustmentsHorizontal, heroWifi, heroTrash })],
  animations: [sparrowFadeIn],
})
export class DeviceDetailsComponent implements OnInit {
  private id?: number;

  private readonly _facadeService: DeviceFacadeService = inject(DeviceFacadeService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  protected readonly deviceDetails: Signal<HomeDevice | null> = this._facadeService.homeDeviceDetails;
  protected readonly switchDevice: Signal<SwitchDevice | null> = computed(() => {
    if (this.deviceDetails() && this.deviceDetails()?.type === DeviceType.POWER_PLUG) {
      return this.deviceDetails() as SwitchDevice;
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
}
