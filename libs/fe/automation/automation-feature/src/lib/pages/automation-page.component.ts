import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { AquaPreferences, AutomationFacadeService } from '@sparrow-home/automation-domain';
import { SelectOption, sparrowFadeIn } from '@sparrow-home/ui';
import { PrimeTemplate } from 'primeng/api';
import { Carousel } from 'primeng/carousel';

import {
  AquariumLightSettingsComponent
} from '../components/aguarium-light-settings/aquarium-light-settings.component';

@Component({
  imports: [CommonModule, Carousel, PrimeTemplate, AquariumLightSettingsComponent],
  templateUrl: './automation-page.component.html',
  animations: [sparrowFadeIn],
})
export class AutomationPageComponent implements OnInit {
  private readonly _facadeService: AutomationFacadeService = inject(AutomationFacadeService);

  protected readonly aquaPreferences: Signal<AquaPreferences | null> = this._facadeService.aquaPreferences;
  protected readonly homeDeviceOptions: Signal<SelectOption<string>[] | null> = this._facadeService.homeDeviceOptions;
  protected readonly carouselItems = [
    { image: 'assets/aquarium.png', label: 'Akwarium' },
    // { image: 'assets/images/garden.png', label: 'Ogród' },
    // { image: 'assets/images/pump.png', label: 'Pompa cyrkulacyjna' }
  ];

  public ngOnInit(): void {
    this._facadeService.fetchInitialData();
  }

  protected onAquaScheduleActive(isActive: boolean): void {
    this._facadeService.setAquaLightScheduler(isActive);
  }

  protected onAquaPreferencesUpdate(preferences: AquaPreferences): void {
    this._facadeService.setPreferences(preferences);
  }
}
