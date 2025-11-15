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
  signal,
  WritableSignal,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutomaticTask, AvailableDevice, TaskAction } from '@sparrow-home/task-domain';
import { DeviceActionComponent, sparrowFadeIn } from '@sparrow-home/ui';
import { DeviceAction } from '@sparrow-home/utils';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { DialogService } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Panel } from 'primeng/panel';
import { Tag } from 'primeng/tag';
import { first } from 'rxjs';

import { ActionFormComponent } from '../action-form/action-form.component';
import { ScheduleForm } from './form-service/model/schedule-form';
import { ScheduleFormService } from './form-service/schedule-form.service';

@Component({
  selector: 'sp-schedule-settings',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Button,
    FloatLabel,
    InputText,
    DataView,
    Tag,
    DeviceActionComponent,
    Panel,
    PrimeTemplate,
  ],
  templateUrl: './schedule-settings.component.html',
  providers: [ScheduleFormService],
  animations: [sparrowFadeIn],
})
export class ScheduleSettingsComponent implements OnInit {
  public readonly task: InputSignal<AutomaticTask | undefined> = input();
  public readonly taskChange: OutputEmitterRef<Partial<AutomaticTask>> = output();
  public readonly isLoading: InputSignal<boolean> = input(false);
  public readonly devices: InputSignal<AvailableDevice[]> = input.required();

  protected formGroup: FormGroup<ScheduleForm> | null = null;
  protected readonly actions: WritableSignal<TaskAction[]> = signal(this.task()?.actions ?? []);
  protected sortedActions: Signal<TaskAction[]> = computed(() =>
    [...this.actions()].sort((a, b) => {
      const timeOfDay: (d: Date) => number = (d: Date) =>
        d.getHours() * 3600000 + d.getMinutes() * 60000 + d.getSeconds() * 1000 + d.getMilliseconds();
      return timeOfDay(a.executionTime) - timeOfDay(b.executionTime);
    })
  );

  private readonly _formService: ScheduleFormService = inject(ScheduleFormService);
  private readonly _dialog: DialogService = inject(DialogService);

  public ngOnInit(): void {
    this._formService.initForm(this.task());
    this.formGroup = this._formService.form;
    this.actions.set(this.task()?.actions ?? []);
  }

  protected onSubmitPreferences(): void {
    if (this.formGroup?.valid) {
      this.taskChange.emit({
        id: this.task()?.id,
        name: this.formGroup?.value.name ?? '',
        isActive: this.task()?.isActive ?? false,
        actions: this.actions(),
      });
      this.formGroup.markAsPristine();
    }
  }

  public onEditAction(action: TaskAction): void {
    this._dialog
      .open(ActionFormComponent, {
        data: action,
        closable: true,
        width: '95vw',
        height: '95vh',
        modal: true,
      })
      ?.onClose.pipe(first())
      .subscribe((results) => {
        if (results) {
          this.actions.update((actions) => {
            const index: number = actions.indexOf(action);
            action = { ...action, ...results };
            actions[index] = action;
            return [...actions];
          });
        }
      });
  }

  protected onAddAction(): void {
    this._dialog
      .open(ActionFormComponent, { closable: true, width: '95vw', height: '95vh', modal: true })
      ?.onClose.pipe(first())
      .subscribe((results: TaskAction) => {
        if (results) {
          const device: AvailableDevice | undefined = this.devices().find(
            (device) => device.homeDeviceId === results.zigbeeDeviceId
          );

          this.actions.update((actions) => [
            ...actions,
            {
              ...results,
              zigbeeDeviceId: device?.homeDeviceId ?? '',
              deviceName: device?.name ?? '',
              deviceDescription: device?.description ?? '',
            },
          ]);
        }
      });
  }

  protected onDeleteAction(index: number): void {
    this.actions.update((actions) => {
      actions.splice(index, 1);
      return [...actions];
    });
  }

  protected onActionChange(index: number, payload: Record<string, unknown>): void {
    this.actions.update((action) => {
      const deviceAction: DeviceAction = action[index].action;
      action[index] = { ...action[index], action: { ...deviceAction, currentValue: payload[deviceAction.key] } };
      return [...action];
    });
  }
}
