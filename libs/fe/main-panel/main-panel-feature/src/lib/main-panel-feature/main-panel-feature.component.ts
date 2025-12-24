import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { VisibilityService } from '@sparrow-home/core';
import { MainPanelStore, mainPanelStore } from '@sparrow-home/main-panel-domain';
import { DeviceListItemComponent, OnboardingComponent, staggeredFadeIn } from '@sparrow-home/ui';
import { HomeDevice } from '@sparrow-home/utils';
import { filter } from 'rxjs';

import { AlarmPanelComponent } from '../components/alarm-panel/alarm-panel.component';
import { DeviceListPanelComponent } from '../components/device-list-panel/device-list-panel.component';
import { TemperaturePanelComponent } from '../components/temperature-panel/temperature-panel.component';

@Component({
  imports: [
    CommonModule,
    TemperaturePanelComponent,
    AlarmPanelComponent,
    DeviceListPanelComponent,
    DeviceListItemComponent,
    TranslatePipe,
    OnboardingComponent,
  ],
  templateUrl: './main-panel-feature.component.html',
  animations: [staggeredFadeIn],
})
export class MainPanelFeatureComponent implements OnInit {
  private readonly _mainPanelStore: MainPanelStore = inject(mainPanelStore);
  private readonly _visibilityService: VisibilityService = inject(VisibilityService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  protected readonly avgTemperature: Signal<number | null> = this._mainPanelStore.avgTemperature;
  protected readonly isAlarmOn: Signal<boolean> = this._mainPanelStore.isAlarmOn;
  protected readonly isAlarmAvailable: Signal<boolean> = this._mainPanelStore.isAlarmAvailable;
  protected readonly isHouseClosed: Signal<boolean | null> = this._mainPanelStore.areAllWindowsAndDoorsClosed;
  protected readonly mainDevices: Signal<HomeDevice[]> = this._mainPanelStore.mainPageDevices;
  protected readonly noDevices: Signal<boolean> = this._mainPanelStore.noDevices;

  public ngOnInit(): void {
    this._mainPanelStore.fetchInitData();

    this._visibilityService.isVisible
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((isVisible) => isVisible)
      )
      .subscribe(() => this._mainPanelStore.fetchInitData());
  }

  protected setAlarm(isAlarmOn: boolean): void {
    this._mainPanelStore.setAlarm(isAlarmOn);
  }

  protected handleDeviceEvent(id: string, payload: Record<string, unknown>): void {
    this._mainPanelStore.publishEvent({ id, payload });
  }
}
