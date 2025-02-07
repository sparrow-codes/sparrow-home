import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCheck, heroPencil, heroTrash } from '@ng-icons/heroicons/outline';
import { HeatingPreferences } from '@sparrow-home/heat-pump-domain';
import { SelectOption } from '@sparrow-home/ui';
import { NgxMaskDirective } from 'ngx-mask';

import { HeatingSettingsFormName } from './form-service/enum/heating-settings-form.enum';
import { HeatingSettingsFormService } from './form-service/heating-settings-form.service';
import { HeatingSettingsForm } from './form-service/model/heating-settings-form';

@Component({
  selector: 'sp-heating-settings',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatSlideToggle,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatSelect,
    MatOption,
    MatLabel,
    MatInput,
    NgxMaskDirective,
    MatCardActions,
    MatButton,
    NgIcon,
  ],
  templateUrl: './heating-settings.component.html',
  providers: [HeatingSettingsFormService, provideIcons({ heroPencil, heroCheck, heroTrash })],
})
export class HeatingSettingsComponent implements OnInit {
  public readonly heatingPreferences: InputSignal<HeatingPreferences> = input.required();
  public readonly sensorOptions: InputSignal<SelectOption<number>[]> = input.required();
  public readonly update: OutputEmitterRef<HeatingPreferences> = output();
  public readonly activated: OutputEmitterRef<boolean> = output();

  protected form?: FormGroup<HeatingSettingsForm>;
  protected readonly formNames: typeof HeatingSettingsFormName = HeatingSettingsFormName;
  protected readonly canBeActivated: Signal<boolean> = computed(() => {
    const preferences: HeatingPreferences = this.heatingPreferences();
    return (
      Boolean(preferences.groundFlorTemperatureSensorId) &&
      Boolean(preferences.firstFlorTemperatureSensorId) &&
      Boolean(preferences.minTargetTemperature) &&
      Boolean(preferences.maxTargetTemperature)
    );
  });

  private readonly _formService: HeatingSettingsFormService = inject(HeatingSettingsFormService);
  private readonly _injector: Injector = inject(Injector);

  public ngOnInit(): void {
    this._formService.initForm(this.heatingPreferences());
    this.form = this._formService.form;
    effect(
      () => {
        this._formService.patchForm(this.heatingPreferences());
      },
      { injector: this._injector }
    );
  }

  protected onSubmit(): void {
    if (this.form?.valid && this.form.touched) {
      this.update.emit({
        ...this.heatingPreferences(),
        groundFlorTemperatureSensorId: this.form.value.groundFlorSensorId ?? undefined,
        firstFlorTemperatureSensorId: this.form.value.firstFlorSensorId ?? undefined,
        maxTargetTemperature: this.form.value.maximumTemperature ? this.form.value.maximumTemperature : undefined,
        minTargetTemperature: this.form.value.minimumTemperature ? this.form.value.minimumTemperature : undefined,
      });

      this.form.disable();
    }

    if (this.form?.valid && this.form?.pristine) {
      this.form?.disable();
    }
  }

  protected onDiscard(): void {
    this.form?.reset();
    this.form?.disable();
  }

  protected clearForm(): void {
    this._formService.clearForm();
  }
}
