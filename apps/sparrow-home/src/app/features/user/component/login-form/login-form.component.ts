import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
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
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroLockOpen } from '@ng-icons/heroicons/outline';
import { ButtonComponent, InputComponent } from '@sparrow-codes/sparrow-ui';

import { LoginRequest } from '~api/user/models/login-request';
import { LoginFormName } from '~user/component/login-form/form-service/enum/loing-form-name';
import { LoginFormService } from '~user/component/login-form/form-service/login-form.service';
import { LoginForm } from '~user/component/login-form/form-service/model/login-form';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent, NgIcon],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoginFormService, provideIcons({ heroLockOpen })],
})
export class LoginFormComponent implements OnInit {
  public readonly onLogin: OutputEmitterRef<LoginRequest> = output();
  public readonly hasError: InputSignal<boolean> = input(false);
  public readonly isLoading: InputSignal<boolean> = input(false);

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
      },
      { allowSignalWrites: true, injector: this._injector }
    );

    this.formGroup.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this.showInvalidLoginError.set(false));
  }

  protected onLoginClick(): void {
    if (this.formGroup.invalid) {
      this.showInvalidLoginError.set(true);
    } else {
      this.onLogin.emit(this.formService.toRequest());
    }
  }
}
