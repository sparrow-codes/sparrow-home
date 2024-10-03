import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroUser } from '@ng-icons/heroicons/outline';
import { ButtonComponent, InputComponent } from '@sparrow-codes/sparrow-ui';

import { CreateUserRequest } from '~api/user/models/create-user-request';
import { CreateUserFormName } from '~user/component/create-user-form/form-service/enum/create-user-form.name';
import { CreateNewUserForm } from '~user/component/create-user-form/form-service/model/create-new-user-form';

import { CreateUserFormService } from './form-service/create-user-form.service';

@Component({
  selector: 'app-create-user-form',
  standalone: true,
  imports: [CommonModule, InputComponent, ReactiveFormsModule, ButtonComponent, NgIcon],
  templateUrl: './create-user-form.component.html',
  styleUrl: './create-user-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CreateUserFormService, provideIcons({ heroUser })],
})
export class CreateUserFormComponent implements OnInit {
  public readonly onFormSave: OutputEmitterRef<CreateUserRequest> = output();

  protected readonly formService: CreateUserFormService = inject(CreateUserFormService);
  protected readonly formGroup: FormGroup<CreateNewUserForm> = this.formService.form;
  protected readonly showMismatchPasswordError: WritableSignal<boolean> = signal(false);
  protected readonly formName: typeof CreateUserFormName = CreateUserFormName;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.formGroup.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.showMismatchPasswordError.set(false);
    });
  }

  protected onSave(): void {
    const passwordMath: boolean = this.formGroup.value.password === this.formGroup.value.repeatPassword;
    if (this.formGroup.valid) {
      if (passwordMath) {
        this.onFormSave.emit(this.formService.toRequest());
      } else {
        this.showMismatchPasswordError.set(true);
      }
    }
  }
}
