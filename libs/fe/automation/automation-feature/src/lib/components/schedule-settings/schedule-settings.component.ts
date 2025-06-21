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
import { SchedulePreferences } from '@sparrow-home/automation-domain';
import { staggeredFadeIn } from '@sparrow-home/ui';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';

import { ScheduleFormName } from './form-service/enum/schedule-form-name';
import { ScheduleForm } from './form-service/model/schedule-form';
import { ScheduleFormService } from './form-service/schedule-form.service';

@Component({
  selector: 'sp-schedule-settings',
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
  templateUrl: './schedule-settings.component.html',
  providers: [ScheduleFormService],
  animations: [staggeredFadeIn],
})
export class ScheduleSettingsComponent implements OnInit {
  public readonly homeDeviceOptions: InputSignal<{ value: string; label: string }[]> = input.required();
  public readonly schedulePreferences: InputSignal<SchedulePreferences> = input.required();
  public readonly header: InputSignal<string> = input.required();
  public readonly preferencesUpdates: OutputEmitterRef<SchedulePreferences> = output();
  public readonly activated: OutputEmitterRef<boolean> = output();

  protected formGroup: FormGroup<ScheduleForm> | null = null;
  protected toControl?: FormControl<Date | null>;

  protected readonly canScheduleBeActivated: Signal<boolean> = computed(() =>
    this.schedulePreferences().canBeActivated()
  );
  protected readonly formName: typeof ScheduleFormName = ScheduleFormName;

  private readonly _formService: ScheduleFormService = inject(ScheduleFormService);

  public ngOnInit(): void {
    this._formService.initForm(this.schedulePreferences());
    this._formService.form?.disable();
    this.formGroup = this._formService.form;
    this.toControl = this._formService.toControl;
  }

  protected editMode(): void {
    this._formService.form?.enable();
  }

  protected readonlyMode(): void {
    this._formService.form?.reset({
      [ScheduleFormName.FROM]: this.schedulePreferences().startTime,
      [ScheduleFormName.TO]: this.schedulePreferences().endTime,
      [ScheduleFormName.HOME_DEVICE]: this.schedulePreferences().homeDeviceId,
    });
    this._formService.form?.disable();
  }

  protected onSubmitPreferences(): void {
    this.formGroup?.markAsTouched();
    if (this.formGroup?.valid) {
      const newPreferences: SchedulePreferences = new SchedulePreferences();
      newPreferences.startTime = this.formGroup?.value.from ?? undefined;
      newPreferences.endTime = this.formGroup?.value.to ?? undefined;
      newPreferences.homeDeviceId = this.formGroup?.value.homeDevice ?? undefined;
      this.preferencesUpdates.emit(newPreferences);

      this._formService.form?.disable();
    }
  }
}
