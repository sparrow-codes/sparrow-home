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
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass, heroPlusCircle } from '@ng-icons/heroicons/outline';
import { TuyaDevice, TuyaFacadeService } from '@sparrow-home/tuya-device-domain';
import { PageTitleComponent } from '@sparrow-home/ui';
import { debounceTime, distinctUntilChanged, filter, take } from 'rxjs';

import { CreateDeviceDialogComponent } from '../create-device-dialog/create-device-dialog.component';
import { CreateDeviceFormName } from '../create-device-dialog/form-service/enum/create-device-form-name';
import { DeviceTypeComponent } from '../device-type/device-type.component';

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
  ],
  templateUrl: './tuya-device-feature.component.html',
  styleUrl: './tuya-device-feature.component.css',
  providers: [provideIcons({ heroMagnifyingGlass, heroPlusCircle })],
})
export class TuyaDeviceFeatureComponent implements OnInit {
  private readonly _facadeService: TuyaFacadeService = inject(TuyaFacadeService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _dialog: MatDialog = inject(MatDialog);

  protected readonly data: Signal<TuyaDevice[] | null> = this._facadeService.tuyaDevices;
  protected readonly columns: string[] = ['id', 'type', 'name', 'tuyaDeviceId'];
  protected readonly searchControl: FormControl<string | null> = new FormControl('');

  public ngOnInit(): void {
    this._facadeService.fetchDevices();
    this._handleSearchEvent();
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
          value[CreateDeviceFormName.TUYA_DEVICE_ID],
          value[CreateDeviceFormName.NAME]
        )
      );
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
