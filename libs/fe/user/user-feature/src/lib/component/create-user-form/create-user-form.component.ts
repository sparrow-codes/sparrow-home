import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreateNewUserRequestApiModel } from '@sparrow-home/api';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';

import { CreateUserFormService } from './form-service/create-user-form.service';
import { CreateUserFormName } from './form-service/enum/create-user-form.name';
import { CreateNewUserForm } from './form-service/model/create-new-user-form';

@Component({
  selector: 'sp-create-user-form',
  imports: [CommonModule, ReactiveFormsModule, Button, Password, FloatLabel, InputText],
  templateUrl: './create-user-form.component.html',
  styleUrl: './create-user-form.component.css',
  providers: [CreateUserFormService],
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
