import { CommonModule } from '@angular/common';
import { Component, effect, inject, Injector, OnInit, Signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DeviceFacadeService } from '@sparrow-home/home-device-domain';
import { deviceTypeDictionary, PageTitleComponent } from '@sparrow-home/ui';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Observable } from 'rxjs';

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
    TranslatePipe,
  ],
  templateUrl: './add-device-page.component.html',
  providers: [CreateDeviceFormService],
})
export class AddDevicePageComponent implements OnInit {
  private readonly _formService: CreateDeviceFormService = inject(CreateDeviceFormService);
  private readonly _translateService: TranslateService = inject(TranslateService);
  private readonly _facadeService: DeviceFacadeService = inject(DeviceFacadeService);
  private readonly _injector: Injector = inject(Injector);

  protected readonly formGroup: FormGroup<CreateDeviceForm> = this._formService.form;
  protected readonly dropdownOptions: { value: number; label: string }[] = this.prepareDropdownOptions();
  protected readonly joinInProgress$: Observable<boolean> = this._facadeService.isRefreshing$;
  protected readonly deviceJoined: Signal<boolean | null> = this._facadeService.devicePaired;

  public ngOnInit(): void {
    effect(
      () => {
        if (this.deviceJoined() !== null) {
          this.formGroup.enable();
        }
      },
      { injector: this._injector }
    );
  }

  protected onJoin(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.formGroup.disable();
      this._facadeService.createDevice(this.formGroup.value.deviceType as number, this.formGroup.value.name as string);
    }
  }

  private prepareDropdownOptions(): { value: number; label: string }[] {
    return Array.from(deviceTypeDictionary.entries()).map(
      ([deviceType, label]) =>
        ({ label: this._translateService.instant(label), value: deviceType } as { value: number; label: string })
    );
  }
}
