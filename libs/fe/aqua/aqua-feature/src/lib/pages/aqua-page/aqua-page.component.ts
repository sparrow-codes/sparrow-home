import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { AquaFacadeService, AquaPreferences } from '@sparrow-home/aqua-domain';
import { PageTitleComponent, sparrowFadeIn } from '@sparrow-home/ui';

import { AquariumLightSettingsComponent } from '../../components/aguarium-light-settings/aquarium-light-settings.component';

@Component({
  selector: 'sp-aqua-page',
  imports: [CommonModule, PageTitleComponent, AquariumLightSettingsComponent],
  templateUrl: './aqua-page.component.html',
  animations: [sparrowFadeIn],
})
export class AquaPageComponent implements OnInit {
  private readonly _facadeService: AquaFacadeService = inject(AquaFacadeService);

  protected readonly homeDeviceOptions: Signal<{ value: string; label: string }[] | null> =
    this._facadeService.homeDeviceOptions;
  protected readonly aquaPreferences: Signal<AquaPreferences | null> = this._facadeService.aquaPreferences;

  public ngOnInit(): void {
    this._facadeService.fetchInitialData();
  }

  protected onPreferenceChanged(aquaPreferences: AquaPreferences): void {
    this._facadeService.setPreferences(aquaPreferences);
  }

  protected onScheduleChanged(isActive: boolean): void {
    this._facadeService.setAquaLightScheduler(isActive);
  }
}
