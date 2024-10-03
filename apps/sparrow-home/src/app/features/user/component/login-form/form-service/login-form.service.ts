import { inject, Injectable } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

import { LoginRequest } from '~api/user/models/login-request';
import { LoginFormName } from '~user/component/login-form/form-service/enum/loing-form-name';
import { LoginForm } from '~user/component/login-form/form-service/model/login-form';

@Injectable({
  providedIn: 'root',
})
export class LoginFormService {
  private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly _form: FormGroup<LoginForm> = this._prepareForm();

  public get form(): FormGroup<LoginForm> {
    return this._form;
  }

  public toRequest(): LoginRequest {
    return {
      email: this._form.value.email ?? '',
      password: this._form.value.password ?? '',
    };
  }

  private _prepareForm(): FormGroup<LoginForm> {
    return this._fb.group({
      [LoginFormName.EMAIL]: this._fb.control('', Validators.required),
      [LoginFormName.PASSWORD]: this._fb.control('', Validators.required),
    });
  }
}
