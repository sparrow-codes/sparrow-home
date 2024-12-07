import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCheck, heroPencil, heroTrash } from '@ng-icons/heroicons/outline';

import { Configuration } from '~core/models/configuration';

import { ConfigurationFormService } from './form-service/configuration-form.service';
import { ConfigurationFormName } from './form-service/enum/configuration-form-name';
import { ConfigurationForm } from './form-service/model/configuration-form';

@Component({
  selector: 'app-configuration-form',
  standalone: true,
  imports: [NgIcon, ReactiveFormsModule, MatFormField, MatInput, MatButton, MatFormFieldModule, MatCardModule],
  templateUrl: './configuration-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfigurationFormService, provideIcons({ heroTrash, heroPencil, heroCheck })],
})
export class ConfigurationFormComponent implements OnInit {
  public readonly configuration: InputSignal<Configuration> = input.required();
  public readonly onSave: OutputEmitterRef<Configuration> = output();

  protected formGroup?: FormGroup<ConfigurationForm>;
  protected readonly formName: typeof ConfigurationFormName = ConfigurationFormName;

  private readonly _formService: ConfigurationFormService = inject(ConfigurationFormService);

  public ngOnInit(): void {
    this._formService.prepareForm(this.configuration());
    this.formGroup = this._formService.form;
    this.formGroup?.disable();
  }

  protected onEdit(): void {
    this.formGroup?.enable();
  }

  protected onCancel(): void {
    this.formGroup?.reset();
    this.formGroup?.disable();
  }

  protected onSubmit(): void {
    this.formGroup?.markAllAsTouched();
    if (this.formGroup?.valid) {
      this.onSave.emit(this._formService.toConfiguration(this.configuration()));
      this.formGroup?.disable();
    }
  }
}
