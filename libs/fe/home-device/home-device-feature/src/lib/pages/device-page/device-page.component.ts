import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonChip } from '@ionic/angular/standalone';
import { DeviceType, MobilePushNotificationService } from '@sparrow-home/core';
import { DeviceFacadeService, OpenDoorSensor, SwitchDevice, TemperatureSensor } from '@sparrow-home/home-device-domain';
import { deviceItemFadeIn, PageTitleComponent, sparrowFadeIn } from '@sparrow-home/ui';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { debounceTime, distinctUntilChanged, filter, first } from 'rxjs';

import { DeviceListItemComponent } from '../../components/device-list-item/device-list-item.component';

type Device = OpenDoorSensor & TemperatureSensor & SwitchDevice;

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    InputText,
    DeviceListItemComponent,
    Tag,
    FormsModule,
    PageTitleComponent,
    Paginator,
    ToggleSwitch,
    RouterLink,
    IonChip,
  ],
  templateUrl: './device-page.component.html',
  animations: [sparrowFadeIn, deviceItemFadeIn],
})
export class DevicePageComponent implements OnInit {
  private readonly _facadeService: DeviceFacadeService = inject(DeviceFacadeService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _pushNotificationService: MobilePushNotificationService = inject(MobilePushNotificationService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  protected readonly data: Signal<Device[] | null> = this._facadeService.homeDevices as Signal<Device[]>;
  protected readonly deviceFilter: Signal<DeviceType | null> = this._facadeService.deviceFilter;
  protected readonly pagination: WritableSignal<PaginatorState> = signal({ page: 0, rows: 4, first: 0 });
  protected readonly paginatedDevices = computed(() => {
    const allDevices: Device[] = this.data() ?? [];
    const { first = 0, rows = 4 } = this.pagination() ?? {};

    return allDevices.slice(first, first + rows);
  });
  protected readonly searchControl: FormControl<string | null> = new FormControl('');
  protected readonly deviceType: typeof DeviceType = DeviceType;

  public ngOnInit(): void {
    this._activatedRoute.queryParams.pipe(first()).subscribe((params) => {
      this._facadeService.setDeviceTypeFilter(params['deviceType']);
      this._facadeService.fetchDevices();
    });

    this._facadeService.fetchDevices();
    this._handleSearchEvent();
    this._pushNotificationService.subscribeToNotifications();
  }

  protected onSwitchAction(id: number, value: boolean): void {
    this._facadeService.setLscSwitchOperationStatus(id, value);
  }

  protected onRemoveFilter(): void {
    this._facadeService.setDeviceTypeFilter('');
    this._facadeService.fetchDevices();
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
        this.pagination.update((value) => ({ ...value, first: 0 }));
      });
  }
}
