import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';
import { TuyaDevice, TuyaFacadeService } from '@sparrow-home/tuya-device-domain';
import { PageTitleComponent } from '@sparrow-home/ui';
import { filter, first, map, tap } from 'rxjs';

import { DeviceTypeComponent } from '../../components/device-type/device-type.component';
import { deviceTypeDictionary } from '../../dictionary/device-type-dictionary';

@Component({
  selector: 'sp-tuya-device-details',
  imports: [CommonModule, PageTitleComponent, MatCard, MatCardContent, DeviceTypeComponent, MatDivider],
  templateUrl: './tuya-device-details.component.html',
  styleUrl: './tuya-device-details.component.css',
})
export class TuyaDeviceDetailsComponent implements OnInit {
  private readonly _facadeService: TuyaFacadeService = inject(TuyaFacadeService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  protected readonly deviceDetails: Signal<TuyaDevice | null> = this._facadeService.tuyaDeviceDetails;
  protected readonly deviceTypeLabel: Signal<string | undefined> = computed(() => {
    const device: TuyaDevice | null = this.deviceDetails();
    return device ? deviceTypeDictionary.get(device.type) : '';
  });

  public ngOnInit(): void {
    this._activatedRoute.paramMap
      .pipe(
        first(),
        map((params) => params.get('id')),
        filter((id) => id !== null),
        tap({
          next: (id: string) => this._facadeService.fetchDeviceDetailsById(Number(id)),
        })
      )
      .subscribe();
  }
}
