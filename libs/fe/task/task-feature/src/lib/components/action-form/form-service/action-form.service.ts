import { inject, Injectable } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

import { ActionForm } from './model/action-form';

@Injectable()
export class ActionFormService {
  private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly _form: FormGroup<ActionForm> = this._prepareForm();

  public readonly form: FormGroup<ActionForm> = this._form;

  private _prepareForm(): FormGroup<ActionForm> {
    return this._fb.group<ActionForm>({
      device: this._fb.control(null, { validators: [Validators.required] }),
      action: this._fb.control(null, Validators.required),
      payload: this._fb.control(null, { validators: [Validators.required] }),
      time: this._fb.control(new Date(), { validators: [Validators.required] }),
    });
  }
}
