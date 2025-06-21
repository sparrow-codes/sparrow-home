import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { heroClock } from '@ng-icons/heroicons/outline';
import { AquaPreferences } from '@sparrow-home/automation-domain';
import { staggeredFadeIn } from '@sparrow-home/ui';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';

import { AquariumLightFormService } from './form-service/aquarium-light-form.service';
import { AquariumLightFormName } from './form-service/enum/aquarium-light-form-name';
import { AquariumLightForm } from './form-service/model/aquarium-light-form';

@Component({
  selector: 'sp-aquarium-light-settings',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Card,
    FormsModule,
    DropdownModule,
    Button,
    ToggleSwitch,
    DatePicker,
    Select,
    FloatLabel,
  ],
  templateUrl: './aquarium-light-settings.component.html',
  providers: [AquariumLightFormService, provideIcons({ heroClock })],
  animations: [staggeredFadeIn]
})
export class AquariumLightSettingsComponent implements OnInit {
  public readonly homeDeviceOptions: InputSignal<{ value: string; label: string }[]> = input.required();
  public readonly aquaPreferences: InputSignal<AquaPreferences> = input.required();
  public readonly preferencesUpdates: OutputEmitterRef<AquaPreferences> = output();
  public readonly activated: OutputEmitterRef<boolean> = output();

  protected formGroup: FormGroup<AquariumLightForm> | null = null;
  protected toControl?: FormControl<Date | null>;

  protected readonly canScheduleBeActivated: Signal<boolean> = computed(() => this.aquaPreferences().canBeActivated());
  protected readonly formName: typeof AquariumLightFormName = AquariumLightFormName;

  private readonly _formService: AquariumLightFormService = inject(AquariumLightFormService);

  public ngOnInit(): void {
    this._formService.initForm(this.aquaPreferences());
    this._formService.form?.disable();
    this.formGroup = this._formService.form;
    this.toControl = this._formService.toControl;
  }

  protected editMode(): void {
    this._formService.form?.enable();
  }

  protected readonlyMode(): void {
    this._formService.form?.reset({
      [AquariumLightFormName.FROM]: this.aquaPreferences().lightStartTime,
      [AquariumLightFormName.TO]: this.aquaPreferences().lightEndTime,
      [AquariumLightFormName.HOME_DEVICE]: this.aquaPreferences().homeDeviceId,
    });
    this._formService.form?.disable();
  }

  protected onSubmitPreferences(): void {
    this.formGroup?.markAsTouched();
    if (this.formGroup?.valid) {
      const newPreferences: AquaPreferences = new AquaPreferences();
      newPreferences.lightStartTime = this.formGroup?.value.from ?? undefined;
      newPreferences.lightEndTime = this.formGroup?.value.to ?? undefined;
      newPreferences.homeDeviceId = this.formGroup?.value.homeDevice ?? undefined;
      this.preferencesUpdates.emit(newPreferences);

      this._formService.form?.disable();
    }
  }
}
