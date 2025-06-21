import { CommonModule } from '@angular/common';
import { Component, inject, output, OutputEmitterRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginRequestApiModel } from '@sparrow-home/api';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';

import { LoginFormName } from './form-service/enum/loing-form-name';
import { LoginFormService } from './form-service/login-form.service';
import { LoginForm } from './form-service/model/login-form';

@Component({
  selector: 'sp-login-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    InputText,
    Password,
    FloatLabel,
    Button,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
  providers: [LoginFormService],
})
export class LoginFormComponent {
  public readonly login: OutputEmitterRef<LoginRequestApiModel> = output();
  public readonly newUserNavigation: OutputEmitterRef<void> = output();

  protected readonly formService: LoginFormService = inject(LoginFormService);
  protected readonly loginForm: FormGroup<LoginForm> = this.formService.form;
  protected readonly formName: typeof LoginFormName = LoginFormName;

  protected onLoginClick(): void {
    this.login.emit(this.formService.toRequest());
    this.loginForm.reset();
  }
}
