import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  selector: 'app-login-form',
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
  protected readonly showInvalidLoginError: WritableSignal<boolean> = signal(false);
  protected readonly formName: typeof LoginFormName = LoginFormName;

  private readonly _injector: Injector = inject(Injector);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    effect(
      () => {
        this.showInvalidLoginError.set(this.hasError());

        if (this.showInvalidLoginError()) {
          this.formGroup.get('password')?.patchValue('' as never, { emitEvent: false });
        }
      },
      { allowSignalWrites: true, injector: this._injector }
    );

    this.formGroup.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this.showInvalidLoginError.set(false);
    });
  }

  protected onLoginClick(): void {
    if (this.formGroup.invalid) {
      this.showInvalidLoginError.set(true);
    } else {
      this.login.emit(this.formService.toRequest());
    }
  }
}
