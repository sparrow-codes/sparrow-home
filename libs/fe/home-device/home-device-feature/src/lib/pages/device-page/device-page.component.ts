import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowRightCircle, heroMagnifyingGlass, heroPlusCircle, heroTrash } from '@ng-icons/heroicons/outline';
import { DeviceFacadeService, HomeDevice } from '@sparrow-home/home-device-domain';
import { LayoutService, PageTitleComponent, sparrowFadeIn } from '@sparrow-home/ui';
import { debounceTime, distinctUntilChanged, filter, take } from 'rxjs';

import { CreateDeviceDialogComponent } from '../../components/create-device-dialog/create-device-dialog.component';
import { CreateDeviceFormName } from '../../components/create-device-dialog/form-service/enum/create-device-form-name';
import { DeviceTypeComponent } from '../../components/device-type/device-type.component';

@Component({
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIcon,
    MatButtonModule,
    DeviceTypeComponent,
    MatDialogModule,
    PageTitleComponent,
    RouterLink,
  ],
  templateUrl: './device-page.component.html',
  styleUrl: './device-page.component.css',
  providers: [provideIcons({ heroMagnifyingGlass, heroPlusCircle, heroTrash, heroArrowRightCircle })],
  animations: [sparrowFadeIn],
})
export class DevicePageComponent implements OnInit {
  private readonly _facadeService: DeviceFacadeService = inject(DeviceFacadeService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _dialog: MatDialog = inject(MatDialog);

  protected readonly data: Signal<HomeDevice[] | null> = this._facadeService.homeDevices;
  protected readonly columns: string[] = ['name', 'type', 'homeDeviceId', 'actions'];
  protected readonly mobileColumns: string[] = ['name', 'type'];
  protected readonly searchControl: FormControl<string | null> = new FormControl('');
  protected readonly layoutService: LayoutService = inject(LayoutService);
  protected readonly isMobile: Signal<boolean> = this.layoutService.isMobile;

  public ngOnInit(): void {
    this._facadeService.fetchDevices();
    this._handleSearchEvent();
  }

  protected onRowClick(row: unknown): void {
    console.log(row);
  }

  protected onAddClick(): void {
    this._dialog
      .open(CreateDeviceDialogComponent)
      .afterClosed()
      .pipe(
        take(1),
        filter((result) => !!result)
      )
      .subscribe((value) =>
        this._facadeService.createDevice(
          value[CreateDeviceFormName.DEVICE_TYPE],
          value[CreateDeviceFormName.HOME_DEVICE_ID],
          value[CreateDeviceFormName.NAME]
        )
      );
  }

  protected onRemoveDevice(device: HomeDevice): void {
    this._facadeService.deleteDevice(device.id, device.name);
  }

  private _handleSearchEvent(): void {
    this.searchControl.valueChanges
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        distinctUntilChanged(),
        debounceTime(300),
        filter((value) => value !== null)
      )
      .subscribe((value) => this._facadeService.setSearchQuery(value));
  }
}
