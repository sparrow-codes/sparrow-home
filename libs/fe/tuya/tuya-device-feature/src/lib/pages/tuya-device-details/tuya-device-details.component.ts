import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroAdjustmentsHorizontal, heroNoSymbol } from '@ng-icons/heroicons/outline';
import { heroCheckCircleSolid } from '@ng-icons/heroicons/solid';
import { DeviceType, TuyaDevice, TuyaFacadeService } from '@sparrow-home/tuya-device-domain';
import { PageTitleComponent } from '@sparrow-home/ui';
import { filter, first, map, tap } from 'rxjs';

import { DeviceTypeComponent } from '../../components/device-type/device-type.component';
import { LcsSwitchManualControlComponent } from '../../components/manual-control/lcs-switch-manual-control/lcs-switch-manual-control.component';

@Component({
  selector: 'sp-tuya-device-details',
  imports: [
    CommonModule,
    PageTitleComponent,
    MatCard,
    MatCardContent,
    DeviceTypeComponent,
    MatDivider,
    NgIcon,
    LcsSwitchManualControlComponent,
  ],
  templateUrl: './tuya-device-details.component.html',
  styleUrl: './tuya-device-details.component.css',
  providers: [provideIcons({ heroNoSymbol, heroCheckCircleSolid, heroAdjustmentsHorizontal })],
})
export class TuyaDeviceDetailsComponent implements OnInit {
  private id?: number;

  private readonly _facadeService: TuyaFacadeService = inject(TuyaFacadeService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  protected readonly deviceDetails: Signal<TuyaDevice | null> = this._facadeService.tuyaDeviceDetails;
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
}
