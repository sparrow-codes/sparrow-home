import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HeatingPreferences } from '@sparrow-home/heat-pump-domain';

import { HeatingSettingsFormName } from './enum/heating-settings-form.enum';
import { HeatingSettingsForm } from './model/heating-settings-form';

@Injectable()
export class HeatingSettingsFormService {
  private _form?: FormGroup<HeatingSettingsForm>;

  private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  public get form(): FormGroup<HeatingSettingsForm> | undefined {
    return this._form;
  }

  public initForm(preferences: HeatingPreferences): void {
    this._form = this._fb.group({
      [HeatingSettingsFormName.GROUND_FLOR_SENSOR_ID]: this._fb.control<number | null>(
        preferences.groundFlorTemperatureSensorId ?? null
      ),
      [HeatingSettingsFormName.FIRST_FLOR_SENSOR_ID]: this._fb.control<number | null>(
        preferences.firstFlorTemperatureSensorId ?? null
      ),
      [HeatingSettingsFormName.MINIMUM_TEMPERATURE]: this._fb.control<number | null>(
        preferences.minTargetTemperature ?? null,
        { validators: [this._minTemperatureValidator()] }
      ),
      [HeatingSettingsFormName.MAXIMUM_TEMPERATURE]: this._fb.control<number | null>(
        preferences.minTargetTemperature ?? null,
        { validators: [this._maxTemperatureValidator()] }
      ),
    });

    this.form?.disable();
  }

  public patchForm(preferences: HeatingPreferences): void {
    this.form
      ?.get([HeatingSettingsFormName.GROUND_FLOR_SENSOR_ID])
      ?.patchValue(preferences.groundFlorTemperatureSensorId);
    this.form
      ?.get([HeatingSettingsFormName.FIRST_FLOR_SENSOR_ID])
      ?.patchValue(preferences.firstFlorTemperatureSensorId);
    this.form?.get([HeatingSettingsFormName.MINIMUM_TEMPERATURE])?.patchValue(preferences.minTargetTemperature);
    this.form?.get([HeatingSettingsFormName.MAXIMUM_TEMPERATURE])?.patchValue(preferences.maxTargetTemperature);
  }

  public clearForm(): void {
    this._form?.patchValue({
      minimumTemperature: null,
      maximumTemperature: null,
      groundFlorSensorId: null,
      firstFlorSensorId: null,
    });
  }

  private _minTemperatureValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: number = control.value;
      const maximumTemperature: number | undefined | null = this.form?.value.maximumTemperature;

      if (value === null || !maximumTemperature) {
        return null;
      }

      if (value > maximumTemperature) {
        return { reportError: 'Invalid min temperature' };
      }

      return null;
    };
  }

  private _maxTemperatureValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: number = control.value;
      const minimumTemperature: number | undefined | null = this.form?.value.minimumTemperature;

      if (value === null || !minimumTemperature) {
        return null;
      }

      if (value <= minimumTemperature) {
        return { reportError: 'Invalid max temperature' };
      }

      return null;
    };
  }
}
