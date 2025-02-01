import { inject, Injectable } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CreateUserRequest } from '@sparrow-home/api';

import { CreateUserFormName } from './enum/create-user-form.name';
import { CreateNewUserForm } from './model/create-new-user-form';

@Injectable()
export class CreateUserFormService {
  private readonly fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly _form: FormGroup<CreateNewUserForm> = this._prepareForm();

  public get form(): FormGroup<CreateNewUserForm> {
    return this._form;
  }

  public toRequest(): CreateUserRequest {
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
      lastName: formValue.lastName,
    };
  }

  private _prepareForm(): FormGroup {
    return this.fb.group({
      [CreateUserFormName.FIRST_NAME]: this.fb.control<string>('', {
        validators: [Validators.required],
      }),
      [CreateUserFormName.EMAIL]: this.fb.control<string>('', {
        validators: [Validators.required, Validators.email],
        updateOn: 'blur',
      }),
      [CreateUserFormName.LAST_NAME]: this.fb.control<string>(''),
      [CreateUserFormName.PASSWORD]: this.fb.control<string>('', Validators.required),
      [CreateUserFormName.REPEAT_PASSWORD]: this.fb.control<string>('', Validators.required),
    });
  }
}
