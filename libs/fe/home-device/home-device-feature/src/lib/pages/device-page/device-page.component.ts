import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, InputSignal, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonLabel,
  IonProgressBar,
  IonSkeletonText,
  IonToolbar,
  ViewWillEnter,
} from '@ionic/angular';
import { bootstrapHouseGear } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DeviceFacadeService } from '@sparrow-home/home-device-domain';
import { DeviceListItemComponent, OnboardingComponent, PageTitleComponent } from '@sparrow-home/ui';
import { DeviceType, HomeDevice } from '@sparrow-home/utils';
import { debounceTime, distinctUntilChanged, filter, Observable } from 'rxjs';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DeviceListItemComponent,
    FormsModule,
    PageTitleComponent,
    RouterLink,
    TranslatePipe,
    NgIcon,
    OnboardingComponent,
    IonChip,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
    IonSkeletonText,
    IonInput,
    IonProgressBar,
  ],
  templateUrl: './device-page.component.html',
  providers: [provideIcons({ bootstrapHouseGear })],
})
export class DevicePageComponent implements ViewWillEnter {
  public readonly deviceType: InputSignal<string> = input('');

  private readonly _facadeService: DeviceFacadeService = inject(DeviceFacadeService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  protected readonly homeDevices: Signal<HomeDevice[] | null> = this._facadeService.homeDevices;
  protected readonly deviceFilter: Signal<DeviceType | null> = this._facadeService.deviceFilter;
  protected readonly noDevices: Signal<boolean | null> = this._facadeService.noDevices;
  protected readonly searchControl: FormControl<string | null> = new FormControl(
    this._facadeService.searchQuery() ?? ''
  );
  protected readonly deviceTypeEnum: typeof DeviceType = DeviceType;
  protected readonly isLoading$: Observable<boolean> = this._facadeService.isLoading$;
  protected readonly isRefreshing$: Observable<boolean> = this._facadeService.isRefreshing$;
  protected readonly refreshingDevices: Signal<Set<string>> = this._facadeService.refreshingObjects;

  public ionViewWillEnter(): void {
    if (this.deviceType()) {
      this._facadeService.setDeviceTypeFilter(+this.deviceType());
    }

    this._facadeService.fetchDevices();

    this._handleSearchEvent();
  }

  protected onRemoveFilter(): void {
    this._facadeService.setDeviceTypeFilter();
    this._facadeService.fetchDevices();
  }

  protected onDeviceEvent(id: string, payload: Record<string, unknown>): void {
    this._facadeService.publishZigbeeEvent(id, payload);
  }

  private _handleSearchEvent(): void {
    this.searchControl.valueChanges
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        distinctUntilChanged(),
        debounceTime(300),
        filter((value) => value !== null)
      )
      .subscribe((value) => {
        this._facadeService.setSearchQuery(value);
      });
  }
}
