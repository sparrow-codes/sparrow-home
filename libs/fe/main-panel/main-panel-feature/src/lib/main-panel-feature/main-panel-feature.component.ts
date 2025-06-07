import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { MainPanelFacadeService } from '@sparrow-home/main-panel-domain';
import { staggeredFadeIn } from '@sparrow-home/ui';

import { AlarmPanelComponent } from '../components/alarm-panel/alarm-panel.component';
import { DeviceListPanelComponent } from '../components/device-list-panel/device-list-panel.component';
import { TemperaturePanelComponent } from '../components/temperature-panel/temperature-panel.component';

@Component({
  imports: [CommonModule, TemperaturePanelComponent, AlarmPanelComponent, DeviceListPanelComponent],
  templateUrl: './main-panel-feature.component.html',
  animations: [staggeredFadeIn]
})
export class MainPanelFeatureComponent implements OnInit {
  private readonly _facadeService: MainPanelFacadeService = inject(MainPanelFacadeService);

  protected readonly avgTemperature: Signal<number | null> = this._facadeService.avgTemperature;
  protected readonly isAlarmOn: Signal<boolean> = this._facadeService.isAlarmOn;

  public ngOnInit(): void {
    this._facadeService.fetchInitData();
  }

  protected setAlarm(isAlarmOn: boolean): void {
    this._facadeService.setAlarm(isAlarmOn);
  }
}
