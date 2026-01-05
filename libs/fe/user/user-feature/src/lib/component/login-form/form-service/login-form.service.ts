import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { LoginRequestApiModel } from '@sparrow-home/api';
import { UserDataFacadeService } from '@sparrow-home/user-domain';

import { LoginFormName } from './enum/loing-form-name';
import { LoginForm } from './model/login-form';

@Injectable({
  providedIn: 'root',
})
export class LoginFormService {
  private readonly _facadeService = inject(UserDataFacadeService);
  private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly _form: FormGroup<LoginForm> = this._prepareForm();

  public get form(): FormGroup<LoginForm> {
    return this._form;
  }

  public constructor() {
    this._facadeService.isLoading$.pipe(takeUntilDestroyed()).subscribe((isLoading) => {
      if (isLoading) {
        this._form.disable();
      } else {
        this._form.enable();
        this._form.controls.password.reset();
      }
    });
  }

  public toRequest(): LoginRequestApiModel {
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
