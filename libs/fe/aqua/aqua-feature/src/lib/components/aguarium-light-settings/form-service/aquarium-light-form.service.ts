import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { AquaPreferences } from '@sparrow-home/aqua-domain';

import { AquariumLightFormName } from './enum/aquarium-light-form-name';
import { AquariumLightForm } from './model/aquarium-light-form';

@Injectable()
export class AquariumLightFormService {
  private _form: FormGroup<AquariumLightForm> | null = null;

  private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  public get form(): FormGroup<AquariumLightForm> | null {
    return this._form;
  }

  public get toControl(): FormControl<Date | null> {
    return this._form?.get([AquariumLightFormName.TO]) as FormControl<Date | null>;
  }

  public initForm(aquaPreferences: AquaPreferences): void {
    this._form = this._fb.group({
      [AquariumLightFormName.HOME_DEVICE]: this._fb.control(aquaPreferences.homeDeviceId ?? null),
      [AquariumLightFormName.FROM]: this._fb.control(aquaPreferences.lightStartTime ?? null),
      [AquariumLightFormName.TO]: this._fb.control(aquaPreferences.lightEndTime ?? null, {
        validators: [this._timeValidator()],
      }),
    });
  }

  private _timeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const from: Date | null | undefined = this._form?.get([AquariumLightFormName.FROM])?.value;
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
