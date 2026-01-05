import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CreateNewUserRequestApiModel } from '@sparrow-home/api';
import { UserDataFacadeService } from '@sparrow-home/user-domain';

import { CreateUserFormName } from './enum/create-user-form.name';
import { CreateNewUserForm } from './model/create-new-user-form';

@Injectable()
export class CreateUserFormService {
  private readonly _facadeService: UserDataFacadeService = inject(UserDataFacadeService);
  private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly _form: FormGroup<CreateNewUserForm> = this._prepareForm();

  public get form(): FormGroup<CreateNewUserForm> {
    return this._form;
  }

  public constructor() {
    this._facadeService.isLoading$.pipe(takeUntilDestroyed()).subscribe((isLoading) => {
      if (isLoading) {
        this._form.disable();
      } else {
        this._form.enable();
      }
    });
  }

  public toRequest(): CreateNewUserRequestApiModel {
    const formValue: Partial<{
      firstName: string;
      email: string;
      lastName: string;
      password: string;
      repeatPassword: string;
    }> = this.form.value;
    return {
      firstName: formValue.firstName ?? '',
      password: formValue.password ?? '',
      email: formValue.email ?? '',
      lastName: formValue.lastName ?? null,
    };
  }

  private _prepareForm(): FormGroup {
    return this._fb.group({
      [CreateUserFormName.FIRST_NAME]: this._fb.control<string>('', {
        validators: [Validators.required],
      }),
      [CreateUserFormName.EMAIL]: this._fb.control<string>('', {
        validators: [Validators.required, Validators.email],
        updateOn: 'blur',
      }),
      [CreateUserFormName.LAST_NAME]: this._fb.control<string>(''),
      [CreateUserFormName.PASSWORD]: this._fb.control<string>('', Validators.required),
      [CreateUserFormName.REPEAT_PASSWORD]: this._fb.control<string>('', Validators.required),
    });
  }
}
