import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatOption, MatSelect } from '@angular/material/select';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCheckCircle, heroExclamationCircle, heroLink } from '@ng-icons/heroicons/outline';
import { DeviceFacadeService } from '@sparrow-home/home-device-domain';
import { finalize, first } from 'rxjs';

import { deviceTypeDictionary } from '../../dictionary/device-type-dictionary';
import { CreateDeviceFormService } from './form-service/create-device-form.service';
import { CreateDeviceFormName } from './form-service/enum/create-device-form-name';
import { CreateDeviceForm } from './form-service/model/create-device-form';

@Component({
  imports: [
    CommonModule,
    MatButton,
    MatError,
    MatInput,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatLabel,
    MatFormField,
    MatDialogModule,
    NgIcon,
    MatProgressSpinner,
  ],
  templateUrl: './create-device-dialog.component.html',
  providers: [CreateDeviceFormService, provideIcons({ heroLink, heroExclamationCircle, heroCheckCircle })],
})
export class CreateDeviceDialogComponent {
  private readonly _formService: CreateDeviceFormService = inject(CreateDeviceFormService);
  private readonly facadeService: DeviceFacadeService = inject(DeviceFacadeService);

  protected readonly formGroup: FormGroup<CreateDeviceForm> = this._formService.form;
  protected readonly deviceTypeControl: FormControl<number | null> = this._formService.deviceTypeControl;
  protected readonly nameControl: FormControl<string> = this._formService.nameControl;
  protected readonly formName: typeof CreateDeviceFormName = CreateDeviceFormName;
  protected readonly dropdownOptions: { value: number; label: string }[] = this.prepareDropdownOptions();
  protected readonly joinInProgress: WritableSignal<boolean> = signal(false);
  protected readonly deviceJoined: WritableSignal<boolean | null> = signal(null);

  protected onJoin(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.joinInProgress.set(true);
      this.deviceJoined.set(null);
      this.formGroup.disable();
      this.facadeService
        .createDevice(this.formGroup.value.deviceType as number, this.formGroup.value.name as string)
        .pipe(
          first(),
          finalize(() => this.joinInProgress.set(false))
        )
        .subscribe((created) => {
          if (!created) {
            this.formGroup.enable();
          }
          this.deviceJoined.set(created);
        });
    }
  }

  private prepareDropdownOptions(): { value: number; label: string }[] {
    return Array.from(deviceTypeDictionary.entries()).map(
      ([deviceType, label]) => ({ label: label, value: deviceType } as { value: number; label: string })
    );
  }
}
