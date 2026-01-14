import { inject, Injectable } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { DeviceType } from '@sparrow-home/utils';

import { CreateDeviceForm } from './model/create-device-form';

@Injectable()
export class CreateDeviceFormService {
  private readonly _form: FormGroup<CreateDeviceForm>;
  private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  public get form(): FormGroup<CreateDeviceForm> {
    return this._form;
  }

  public constructor() {
    this._form = this._prepareForm();
  }

  private _prepareForm(): FormGroup<CreateDeviceForm> {
    return this._fb.group({
      deviceType: this._fb.control<number | null>(DeviceType.OTHER, {
        validators: [Validators.required],
      }),
      name: this._fb.control<string>('', {
        validators: [Validators.required, Validators.maxLength(100)],
        updateOn: 'blur',
      }),
    });
  }
}
