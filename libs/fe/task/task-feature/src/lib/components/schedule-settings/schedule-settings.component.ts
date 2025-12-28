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
  signal,
  WritableSignal,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AutomaticTask, AvailableDevice, TaskAction } from '@sparrow-home/task-domain';
import { DaysOfWeekControl, DeviceActionComponent } from '@sparrow-home/ui';
import { DeviceAction } from '@sparrow-home/utils';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { Drawer } from 'primeng/drawer';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Panel } from 'primeng/panel';
import { Tag } from 'primeng/tag';

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
    Drawer,
    ActionFormComponent,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    DaysOfWeekControl,
    TranslatePipe,
  ],
  templateUrl: './schedule-settings.component.html',
  providers: [ScheduleFormService],
})
export class ScheduleSettingsComponent implements OnInit {
  public readonly task: InputSignal<AutomaticTask | undefined> = input();
  public readonly taskChange: OutputEmitterRef<Partial<AutomaticTask>> = output();
  public readonly isLoading: InputSignal<boolean> = input(false);
  public readonly devices: InputSignal<AvailableDevice[]> = input.required();

  protected showAddAction: boolean = false;
  protected showEditAction: boolean = false;
  protected actionToEdit?: TaskAction;

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
  private readonly _injector: Injector = inject(Injector);

  public ngOnInit(): void {
    this._formService.initForm(this.task());
    this.formGroup = this._formService.form;
    this.actions.set(this.task()?.actions ?? []);

    effect(
      () => {
        if (this.isLoading()) {
          this.formGroup?.disable();
        } else {
          this.formGroup?.enable();
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
        isActive: this.task()?.isActive ?? false,
        actions: this.actions(),
        daysOfWeek: this.formGroup?.value?.daysOfWeek,
      });
      this.formGroup.markAsPristine();
    }
  }

  protected onEditActionData(action?: TaskAction): void {
    if (!action || !this.actionToEdit) return;

    this.actions.update((actions) => {
      const index: number = actions.indexOf(this.actionToEdit as TaskAction);

      actions[index] = { ...this.actionToEdit, ...action };
      return [...actions];
    });
    this.showEditAction = false;
  }

  protected onAddActionData(results?: TaskAction): void {
    if (!results) return;

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

    this.showAddAction = false;
  }

  protected onDeleteAction(index: number): void {
    this.actions.update((actions) => {
      actions.splice(index, 1);
      return [...actions];
    });
  }

  protected onActionChange(index: number, payload: Record<string, unknown>): void {
    this.actions.update((actions) => {
      const deviceAction: DeviceAction = actions[index].action;
      actions[index] = { ...actions[index], action: { ...deviceAction, currentValue: payload[deviceAction.key] } };
      return actions;
    });
  }

  protected showAddActionForm(): void {
    this.showAddAction = true;
  }

  protected showEditActionForm(action: TaskAction): void {
    this.actionToEdit = action;
    this.showEditAction = true;
  }
}
