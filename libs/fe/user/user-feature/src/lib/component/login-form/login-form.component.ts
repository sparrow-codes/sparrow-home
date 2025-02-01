import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  Injector,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCardContent } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroLockOpen } from '@ng-icons/heroicons/outline';
import { LoginRequest } from '@sparrow-home/api';

import { LoginFormName } from './form-service/enum/loing-form-name';
import { LoginFormService } from './form-service/login-form.service';
import { LoginForm } from './form-service/model/login-form';

@Component({
  selector: 'sp-login-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIcon,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardActions,
    MatCardContent,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
  providers: [LoginFormService, provideIcons({ heroLockOpen })],
})
export class LoginFormComponent implements OnInit {
  public readonly login: OutputEmitterRef<LoginRequest> = output();
  public readonly hasError: InputSignal<boolean> = input(false);

  protected readonly formService: LoginFormService = inject(LoginFormService);
  protected readonly formGroup: FormGroup<LoginForm> = this.formService.form;
  protected readonly showInvalidFormError: WritableSignal<boolean> = signal(false);
  protected readonly formName: typeof LoginFormName = LoginFormName;
  protected readonly passwordControl: FormControl<string> = this.formService.passwordControl;

  private readonly _injector: Injector = inject(Injector);

  public ngOnInit(): void {
    effect(
      () => {
        if (this.hasError()) {
          this.formService.passwordControl.reset('', { emitEvent: false });
        }
      },
      { injector: this._injector }
    );
  }

  protected onLoginClick(): void {
    if (this.formGroup.invalid) {
      this.showInvalidFormError.set(true);
      this.formService.passwordControl.reset('', { emitEvent: false });
    } else {
      this.login.emit(this.formService.toRequest());
    }
  }
}
