import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  Injector,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutomaticTask, AvailableDevice } from '@sparrow-home/task-domain';
import { staggeredFadeIn } from '@sparrow-home/ui';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';

import { ScheduleForm } from './form-service/model/schedule-form';
import { ScheduleFormService } from './form-service/schedule-form.service';

@Component({
  selector: 'sp-schedule-settings',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    Button,
    DatePicker,
    FloatLabel,
    InputText,
    MultiSelect,
  ],
  templateUrl: './schedule-settings.component.html',
  providers: [ScheduleFormService],
  animations: [staggeredFadeIn],
})
export class ScheduleSettingsComponent implements OnInit {
  public readonly task: InputSignal<AutomaticTask | undefined> = input();
  public readonly taskChange: OutputEmitterRef<Partial<AutomaticTask>> = output();
  public readonly options: InputSignal<AvailableDevice[]> = input.required();
  public readonly isLoading: InputSignal<boolean> = input(false);

  protected formGroup: FormGroup<ScheduleForm> | null = null;

  private readonly _formService: ScheduleFormService = inject(ScheduleFormService);
  private readonly _injector: Injector = inject(Injector);

  public ngOnInit(): void {
    this._formService.initForm(this.task());
    this.formGroup = this._formService.form;

    effect(
      () => {
        const task: AutomaticTask | undefined = this.task();

        if (this.options().length && task) {
          this.formGroup?.controls.devices.patchValue(task.homeDevices, { emitEvent: false });
        }
      },
      { injector: this._injector }
    );
  }

  protected onSubmitPreferences(): void {
    if (this.formGroup?.valid) {
      this.taskChange.emit({
        id: this.task()?.id,
        name: this.formGroup?.value.name ?? '',
        homeDevices: this.formGroup?.value.devices ?? [],
        startTime: this.formGroup?.value.from ?? undefined,
        endTime: this.formGroup?.value.to ?? undefined,
        isActive: this.task()?.isActive ?? false,
      });
      this.formGroup.markAsPristine();
    }
  }
}
