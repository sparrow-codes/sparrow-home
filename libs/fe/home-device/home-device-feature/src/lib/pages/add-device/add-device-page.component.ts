import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DeviceFacadeService } from '@sparrow-home/home-device-domain';
import { PageTitleComponent, staggeredFadeIn } from '@sparrow-home/ui';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { finalize, first } from 'rxjs';

import { deviceTypeDictionary } from '../../dictionary/device-type-dictionary';
import { CreateDeviceFormService } from './form-service/create-device-form.service';
import { CreateDeviceForm } from './form-service/model/create-device-form';

@Component({
  imports: [
    CommonModule,
    PageTitleComponent,
    Card,
    ReactiveFormsModule,
    InputText,
    Button,
    FloatLabel,
    Select,
    RouterLink,
  ],
  templateUrl: './add-device-page.component.html',
  providers: [CreateDeviceFormService],
  animations: [staggeredFadeIn],
})
export class AddDevicePageComponent {
  private readonly _formService: CreateDeviceFormService = inject(CreateDeviceFormService);
  private readonly facadeService: DeviceFacadeService = inject(DeviceFacadeService);

  protected readonly formGroup: FormGroup<CreateDeviceForm> = this._formService.form;
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
