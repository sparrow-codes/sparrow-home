import { inject, Injectable } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

import { CreateDeviceFormName } from './enum/create-device-form-name';
import { CreateDeviceForm } from './model/create-device-form';

@Injectable()
export class CreateDeviceFormService {
  private readonly _form: FormGroup<CreateDeviceForm>;
  private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  public get form(): FormGroup<CreateDeviceForm> {
    return this._form;
  }

  public get deviceTypeControl(): FormControl<number | null> {
    return this._form.get(CreateDeviceFormName.DEVICE_TYPE) as FormControl<number | null>;
  }

  public get nameControl(): FormControl<string> {
    return this._form.get(CreateDeviceFormName.NAME) as FormControl<string>;
  }

  public constructor() {
    this._form = this._prepareForm();
  }

  private _prepareForm(): FormGroup<CreateDeviceForm> {
    return this._fb.group({
      [CreateDeviceFormName.DEVICE_TYPE]: this._fb.control<number | null>(null, {
        validators: [Validators.required],
      }),
      [CreateDeviceFormName.NAME]: this._fb.control<string>('', {
        validators: [Validators.required, Validators.maxLength(100)],
        updateOn: 'blur',
      }),
    });
  }
}
