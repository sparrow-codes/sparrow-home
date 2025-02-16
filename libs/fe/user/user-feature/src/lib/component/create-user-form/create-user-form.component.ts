import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroUser } from '@ng-icons/heroicons/outline';
import { CreateNewUserRequestApiModel } from '@sparrow-home/api';

import { CreateUserFormService } from './form-service/create-user-form.service';
import { CreateUserFormName } from './form-service/enum/create-user-form.name';
import { CreateNewUserForm } from './form-service/model/create-new-user-form';

@Component({
  selector: 'sp-create-user-form',
  imports: [CommonModule, ReactiveFormsModule, NgIcon, MatFormField, MatInput, MatButton, MatFormFieldModule],
  templateUrl: './create-user-form.component.html',
  styleUrl: './create-user-form.component.css',
  providers: [CreateUserFormService, provideIcons({ heroUser })],
})
export class CreateUserFormComponent implements OnInit {
  public readonly formSave: OutputEmitterRef<CreateNewUserRequestApiModel> = output();

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
        this.formSave.emit(this.formService.toRequest());
      } else {
        this.showMismatchPasswordError.set(true);
      }
    }
  }
}
