import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { provideIcons } from '@ng-icons/core';
import { heroArrowRightCircle, heroMagnifyingGlass, heroPlusCircle, heroTrash } from '@ng-icons/heroicons/outline';
import { DeviceType, MobilePushNotificationService } from '@sparrow-home/core';
import { DeviceFacadeService, OpenDoorSensor, SwitchDevice, TemperatureSensor } from '@sparrow-home/home-device-domain';
import { deviceItemFadeIn, PageTitleComponent, sparrowFadeIn } from '@sparrow-home/ui';
import { Button } from 'primeng/button';
import { InputSwitch } from 'primeng/inputswitch';
import { InputText } from 'primeng/inputtext';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { Tag } from 'primeng/tag';
import { debounceTime, distinctUntilChanged, filter, take } from 'rxjs';

import { CreateDeviceDialogComponent } from '../../components/create-device-dialog/create-device-dialog.component';
import { DeviceListItemComponent } from '../../components/device-list-item/device-list-item.component';

type Device = OpenDoorSensor & TemperatureSensor & SwitchDevice;

@Component({
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    Button,
    InputText,
    DeviceListItemComponent,
    Tag,
    InputSwitch,
    FormsModule,
    PageTitleComponent,
    Paginator,
  ],
  templateUrl: './device-page.component.html',
  providers: [provideIcons({ heroMagnifyingGlass, heroPlusCircle, heroTrash, heroArrowRightCircle })],
  animations: [sparrowFadeIn, deviceItemFadeIn],
})
export class DevicePageComponent implements OnInit {
  private readonly _facadeService: DeviceFacadeService = inject(DeviceFacadeService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _dialog: MatDialog = inject(MatDialog);
  private readonly _pushNotificationService: MobilePushNotificationService = inject(MobilePushNotificationService);

  protected readonly data: Signal<Device[] | null> = this._facadeService.homeDevices as Signal<Device[]>;
  protected readonly pagination: WritableSignal<PaginatorState> = signal({ page: 0, rows: 4, first: 0 });
  protected readonly paginatedDevices = computed(() => {
    const allDevices: Device[] = this.data() ?? [];
    const { first = 0, rows = 4 } = this.pagination() ?? {};

    return allDevices.slice(first, first + rows);
  });
  protected readonly searchControl: FormControl<string | null> = new FormControl('');
  protected readonly deviceType: typeof DeviceType = DeviceType;

  public ngOnInit(): void {
    this._facadeService.fetchDevices();
    this._handleSearchEvent();
    this._pushNotificationService.subscribeToNotifications();
  }

  protected onAddClick(): void {
    this._dialog
      .open(CreateDeviceDialogComponent, { disableClose: true, width: '350px' })
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => this._facadeService.fetchDevices());
  }

  protected onSwitchAction(id: number, value: boolean): void {
    this._facadeService.setLscSwitchOperationStatus(id, value);
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
