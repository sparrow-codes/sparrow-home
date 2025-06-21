import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { AquaPreferences } from '@sparrow-home/automation-domain';

import { ScheduleFormName } from './enum/schedule-form-name';
import { ScheduleForm } from './model/schedule-form';

@Injectable()
export class ScheduleFormService {
  private _form: FormGroup<ScheduleForm> | null = null;

  private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  public get form(): FormGroup<ScheduleForm> | null {
    return this._form;
  }

  public get toControl(): FormControl<Date | null> {
    return this._form?.get([ScheduleFormName.TO]) as FormControl<Date | null>;
  }

  public initForm(aquaPreferences: AquaPreferences): void {
    this._form = this._fb.group({
      [ScheduleFormName.HOME_DEVICE]: this._fb.control(aquaPreferences.homeDeviceId ?? null),
      [ScheduleFormName.FROM]: this._fb.control(aquaPreferences.startTime ?? null),
      [ScheduleFormName.TO]: this._fb.control(aquaPreferences.endTime ?? null, {
        validators: [this._timeValidator()],
      }),
    });
  }

  private _timeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const from: Date | null | undefined = this._form?.get([ScheduleFormName.FROM])?.value;
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
