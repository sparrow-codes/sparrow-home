import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTimepicker, MatTimepickerInput, MatTimepickerToggle } from '@angular/material/timepicker';
import { CircularPumpPreferences } from '@sparrow-home/heat-pump-domain';

import { CircularPumpSettingsFormService } from './form-service/circular-pump-settings-form.service';
import { CircularPumpSettingFormName } from './form-service/enum/circular-pump-setting-form-name';
import { CircularPumpForm } from './form-service/model/circular-pump-form';

@Component({
  selector: 'sp-circular-pump-settings',
  imports: [
    CommonModule,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatError,
    MatFormField,
    MatInput,
    MatSlideToggle,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatTimepickerInput,
    MatTimepickerToggle,
    MatTimepicker,
    MatLabel,
  ],
  templateUrl: './circular-pump-settings.component.html',
  providers: [CircularPumpSettingsFormService],
})
export class CircularPumpSettingsComponent implements OnInit {
  public readonly homeDeviceOptions: InputSignal<{ value: string; label: string }[]> = input.required();
  public readonly circularPumpPreferences: InputSignal<CircularPumpPreferences> = input.required();
  public readonly preferencesUpdates: OutputEmitterRef<CircularPumpPreferences> = output();
  public readonly activated: OutputEmitterRef<boolean> = output();

  protected formGroup: FormGroup<CircularPumpForm> | null = null;
  protected toControl?: FormControl<Date | null>;

  protected readonly canScheduleBeActivated: Signal<boolean> = computed(() =>
    this.circularPumpPreferences().canBeActivated()
  );
  protected readonly formName: typeof CircularPumpSettingFormName = CircularPumpSettingFormName;

  private readonly _formService: CircularPumpSettingsFormService = inject(CircularPumpSettingsFormService);

  public ngOnInit(): void {
    this._formService.initForm(this.circularPumpPreferences());
    this._formService.form?.disable();
    this.formGroup = this._formService.form;
    this.toControl = this._formService.toControl;
  }

  protected editMode(): void {
    this._formService.form?.enable();
  }

  protected readonlyMode(): void {
    this._formService.form?.reset({
      [CircularPumpSettingFormName.FROM]: this.circularPumpPreferences().scheduledStartTime,
      [CircularPumpSettingFormName.TO]: this.circularPumpPreferences().scheduledEndTime,
      [CircularPumpSettingFormName.HOME_DEVICE]: this.circularPumpPreferences().homeDeviceId,
    });
    this._formService.form?.disable();
  }

  protected onSubmitPreferences(): void {
    this.formGroup?.markAsTouched();
    if (this.formGroup?.valid) {
      const newPreferences: CircularPumpPreferences = new CircularPumpPreferences();
      newPreferences.scheduledStartTime = this.formGroup?.value.from ?? undefined;
      newPreferences.scheduledEndTime = this.formGroup?.value.to ?? undefined;
      newPreferences.homeDeviceId = this.formGroup?.value.homeDevice ?? undefined;
      this.preferencesUpdates.emit(newPreferences);

      this._formService.form?.disable();
    }
  }
}
