import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { AquaPreferences, AutomationFacadeService } from '@sparrow-home/automation-domain';
import { CircularPumpPreferences } from '@sparrow-home/heat-pump-domain';
import { SelectOption, sparrowFadeIn } from '@sparrow-home/ui';
import { PrimeTemplate } from 'primeng/api';
import { Carousel, CarouselPageEvent } from 'primeng/carousel';

import {
  ScheduleSettingsComponent
} from '../components/schedule-settings/schedule-settings.component';

@Component({
  imports: [CommonModule, Carousel, PrimeTemplate, ScheduleSettingsComponent],
  templateUrl: './automation-page.component.html',
  animations: [sparrowFadeIn],
})
export class AutomationPageComponent implements OnInit {
  private readonly _facadeService: AutomationFacadeService = inject(AutomationFacadeService);

  protected readonly pageIndex: WritableSignal<number> = signal(0);
  protected readonly aquaPreferences: Signal<AquaPreferences | null> = this._facadeService.aquaPreferences;
  protected readonly circularPumpPreferences: Signal<CircularPumpPreferences | null> = this._facadeService.circularPumpPreferences;
  protected readonly homeDeviceOptions: Signal<SelectOption<string>[] | null> = this._facadeService.homeDeviceOptions;
  protected readonly carouselItems = [
    { image: 'assets/aquarium.png', label: 'Akwarium' },
    // { image: 'assets/images/garden.png', label: 'Ogród' },
    { image: 'assets/pump.png', label: 'Pompa cyrkulacyjna' }
  ];

  public ngOnInit(): void {
    this._facadeService.fetchInitialData();
  }

  protected handleScroll(event: CarouselPageEvent): void {
    this.pageIndex.set(<number>event.page);
  }

  protected onAquaScheduleActive(isActive: boolean): void {
    this._facadeService.setAquaLightScheduler(isActive);
  }

  protected onCircularPumpScheduleActive(isActive: boolean): void {
    this._facadeService.setCircularPumpScheduler(isActive);
  }

  protected onAquaPreferencesUpdate(preferences: AquaPreferences): void {
    this._facadeService.setAquaPreferences(preferences);
  }

  protected onCircularPumpPreferencesUpdate(preferences: CircularPumpPreferences): void {
    this._facadeService.setCircularPumpPreferences(preferences);
  }
}
