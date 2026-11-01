import { Component, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonButton, IonInput, IonInputPasswordToggle, IonLabel, IonSpinner } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { LoginRequestApiModel } from '@sparrow-home/api';

import { LoginFormService } from './form-service/login-form.service';
import { LoginForm } from './form-service/model/login-form';

@Component({
  selector: 'sp-login-form',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    IonButton,
    IonSpinner,
    RouterLink,
    IonInput,
    IonInputPasswordToggle,
    IonLabel,
  ],
  templateUrl: './login-form.component.html',
  providers: [LoginFormService],
})
export class LoginFormComponent {
  public readonly login: OutputEmitterRef<LoginRequestApiModel> = output();
  public readonly isLoading: InputSignal<boolean> = input(false);
  public readonly newUserLink: InputSignal<string> = input.required();

  protected readonly formService: LoginFormService = inject(LoginFormService);
  protected readonly loginForm: FormGroup<LoginForm> = this.formService.form;

  protected onLoginClick(): void {
    if (this.formService.form.invalid) {
      return;
    }

    this.login.emit(this.formService.toRequest());
  }
}
