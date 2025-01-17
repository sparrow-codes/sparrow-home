import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { CircularPumpPreferences } from '@sparrow-home/heat-pump-domain';

import { CircularPumpSettingFormName } from './enum/circular-pump-setting-form-name';
import { CircularPumpForm } from './model/circular-pump-form';

@Injectable()
export class CircularPumpSettingsFormService {
  private _form: FormGroup<CircularPumpForm> | null = null;

  private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  public get form(): FormGroup<CircularPumpForm> | null {
    return this._form;
  }

  public get toControl(): FormControl<Date | null> {
    return this._form?.get([CircularPumpSettingFormName.TO]) as FormControl<Date | null>;
  }

  public initForm(preferences: CircularPumpPreferences): void {
    this._form = this._fb.group({
      [CircularPumpSettingFormName.HOME_DEVICE]: this._fb.control(preferences.homeDeviceId ?? null),
      [CircularPumpSettingFormName.FROM]: this._fb.control(preferences.scheduledStartTime ?? null),
      [CircularPumpSettingFormName.TO]: this._fb.control(preferences.scheduledEndTime ?? null, {
        validators: [this._timeValidator()],
      }),
    });
  }

  private _timeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const from: Date | null | undefined = this._form?.get([CircularPumpSettingFormName.FROM])?.value;
      const to: Date | null = control.value;

      if (!from || !to) {
        return null;
      }

      if (from >= to) {
        return { err: 'Invalid times' } as ValidationErrors;
      }

      return null;
    };
  }
}
