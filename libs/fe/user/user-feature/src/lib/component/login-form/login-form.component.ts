import { CommonModule } from '@angular/common';
import { Component, inject, output, OutputEmitterRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { LoginRequestApiModel } from '@sparrow-home/api';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';

import { LoginFormService } from './form-service/login-form.service';
import { LoginForm } from './form-service/model/login-form';

@Component({
  selector: 'sp-login-form',
  imports: [CommonModule, ReactiveFormsModule, InputText, Password, FloatLabel, Button, TranslatePipe],
  templateUrl: './login-form.component.html',
  providers: [LoginFormService],
})
export class LoginFormComponent {
  public readonly login: OutputEmitterRef<LoginRequestApiModel> = output();
  public readonly newUserNavigation: OutputEmitterRef<void> = output();

  protected readonly formService: LoginFormService = inject(LoginFormService);
  protected readonly loginForm: FormGroup<LoginForm> = this.formService.form;

  protected onLoginClick(): void {
    this.login.emit(this.formService.toRequest());
    this.loginForm.reset();
  }
}
