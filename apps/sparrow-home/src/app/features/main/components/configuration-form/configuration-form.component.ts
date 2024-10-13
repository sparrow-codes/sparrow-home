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
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCheck, heroPencil, heroTrash } from '@ng-icons/heroicons/outline';
import { ButtonComponent, InputComponent, sparrowFadeIn } from '@sparrow-codes/sparrow-ui';

import { Configuration } from '~core/models/configuration';
import { PageSubtitleComponent } from '~ui/components/page-subtitle/page-subtitle.component';

import { ConfigurationFormService } from './form-service/configuration-form.service';
import { ConfigurationFormName } from './form-service/enum/configuration-form-name';
import { ConfigurationForm } from './form-service/model/configuration-form';

@Component({
  selector: 'app-configuration-form',
  standalone: true,
  imports: [ButtonComponent, NgIcon, ReactiveFormsModule, InputComponent, PageSubtitleComponent],
  templateUrl: './configuration-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfigurationFormService, provideIcons({ heroTrash, heroPencil, heroCheck })],
  animations: [sparrowFadeIn],
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
    this.onSave.emit(this._formService.toConfiguration(this.configuration()));
    this.formGroup?.disable();
  }
}
