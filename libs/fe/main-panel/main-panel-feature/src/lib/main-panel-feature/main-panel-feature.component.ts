import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VisibilityService } from '@sparrow-home/core';
import { MainPanelFacadeService } from '@sparrow-home/main-panel-domain';
import { staggeredFadeIn } from '@sparrow-home/ui';
import { filter } from 'rxjs';

import { AlarmPanelComponent } from '../components/alarm-panel/alarm-panel.component';
import { DeviceListPanelComponent } from '../components/device-list-panel/device-list-panel.component';
import { TemperaturePanelComponent } from '../components/temperature-panel/temperature-panel.component';

@Component({
  imports: [CommonModule, TemperaturePanelComponent, AlarmPanelComponent, DeviceListPanelComponent],
  templateUrl: './main-panel-feature.component.html',
  animations: [staggeredFadeIn],
})
export class MainPanelFeatureComponent implements OnInit {
  private readonly _facadeService: MainPanelFacadeService = inject(MainPanelFacadeService);
  private readonly _visibilityService: VisibilityService = inject(VisibilityService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  protected readonly avgTemperature: Signal<number | null> = this._facadeService.avgTemperature;
  protected readonly isAlarmOn: Signal<boolean> = this._facadeService.isAlarmOn;
  protected readonly isAlarmAvailable: Signal<boolean> = this._facadeService.isAlarmAvailable;
  protected readonly isHouseClosed: Signal<boolean | null> = this._facadeService.isHouseClosed;

  public ngOnInit(): void {
    this._facadeService.fetchInitData();

    this._visibilityService.isVisible
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((isVisible) => isVisible)
      )
      .subscribe(() => this._facadeService.fetchInitData());
  }

  protected setAlarm(isAlarmOn: boolean): void {
    this._facadeService.setAlarm(isAlarmOn);
  }
}
