import { inject, Injectable } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { LoginRequest } from '@sparrow-home/api';

import { LoginFormName } from './enum/loing-form-name';
import { LoginForm } from './model/login-form';

@Injectable({
  providedIn: 'root',
})
export class LoginFormService {
  private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly _form: FormGroup<LoginForm> = this._prepareForm();

  public get form(): FormGroup<LoginForm> {
    return this._form;
  }

  public get passwordControl(): FormControl {
    return this._form.get(LoginFormName.PASSWORD) as FormControl;
  }

  public toRequest(): LoginRequest {
    return {
      email: this._form.value.email ?? '',
      password: this._form.value.password ?? '',
    };
  }

  private _prepareForm(): FormGroup<LoginForm> {
    return this._fb.group({
      [LoginFormName.EMAIL]: this._fb.control<string>('', Validators.required),
      [LoginFormName.PASSWORD]: this._fb.control<string>('', Validators.required),
    });
  }
}
