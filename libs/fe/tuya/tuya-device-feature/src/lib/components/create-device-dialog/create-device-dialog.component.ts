import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

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
  ],
  templateUrl: './create-device-dialog.component.html',
  styleUrl: './create-device-dialog.component.css',
  providers: [CreateDeviceFormService],
})
export class CreateDeviceDialogComponent {
  private readonly _formService: CreateDeviceFormService = inject(CreateDeviceFormService);
  private readonly _dialogRef: MatDialogRef<CreateDeviceDialogComponent> = inject(
    MatDialogRef<CreateDeviceDialogComponent>
  );

  protected readonly formGroup: FormGroup<CreateDeviceForm> = this._formService.form;
  protected readonly deviceTypeControl: FormControl<number | null> = this._formService.deviceTypeControl;
  protected readonly nameControl: FormControl<string> = this._formService.nameControl;
  protected readonly tuyaIdControl: FormControl<string> = this._formService.tuyaIdControl;
  protected readonly formName: typeof CreateDeviceFormName = CreateDeviceFormName;
  protected readonly dropdownOptions: { value: number; label: string }[] = this.prepareDropdownOptions();

  protected onSave(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this._dialogRef.close(this.formGroup.value);
    }
  }

  private prepareDropdownOptions(): { value: number; label: string }[] {
    return Array.from(deviceTypeDictionary.entries()).map(
      ([deviceType, label]) => ({ label: label, value: deviceType } as { value: number; label: string })
    );
  }
}
