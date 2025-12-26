import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  model,
  ModelSignal,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AvailableDevice, TaskAction, TasksSignalStore, tasksSignalStore } from '@sparrow-home/task-domain';
import { DaysOfWeekControl, DeviceActionComponent } from '@sparrow-home/ui';
import { DeviceAction, humanize } from '@sparrow-home/utils';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';

import { ActionFormService } from './form-service/action-form.service';
import { ActionForm } from './form-service/model/action-form';

@Component({
  selector: 'sp-action-form',
  imports: [
    CommonModule,
    Select,
    ReactiveFormsModule,
    DeviceActionComponent,
    DatePicker,
    FloatLabel,
    Button,
    DaysOfWeekControl,
    TranslatePipe,
  ],
  templateUrl: './action-form.component.html',
  providers: [ActionFormService],
})
export class ActionFormComponent implements OnInit {
  public readonly taskAction: ModelSignal<TaskAction | undefined> = model();

  private readonly _store: TasksSignalStore = inject(tasksSignalStore);
  private readonly _formService: ActionFormService = inject(ActionFormService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  protected readonly form: FormGroup<ActionForm> = this._formService.form;
  protected readonly devices: Signal<AvailableDevice[]> = this._store.availableDevices;
  protected readonly actions: WritableSignal<DeviceAction[]> = signal([]);
  protected readonly actionOptions: Signal<{ key: string; value: unknown }[]> = computed(() => {
    return this.actions().map((action) => ({ key: humanize(action.key), value: action.key }));
  });
  protected readonly selectedAction: WritableSignal<DeviceAction | null> = signal(null);

  public ngOnInit(): void {
    const action: TaskAction | undefined = this.taskAction();

    if (action) {
      this.form.patchValue({
        time: action.executionTime,
        device: action.zigbeeDeviceId,
        action: action.action.key,
        daysOfWeek: action.daysOfWeek,
        payload: {
          [action.action.key]: action.action.currentValue,
        },
      });

      this._setActions(action.zigbeeDeviceId);
      this.selectedAction.set(action.action);
      this._patchActionPayload(action.action);
    }

    this._handleFormEvents();
  }

  protected save(): void {
    if (this.form.invalid) return;

    const deviceAction: DeviceAction | null = this.selectedAction();
    const payload: Record<string, unknown> | null = this.form.controls.payload.value;

    if (deviceAction && payload) {
      this.taskAction.set({
        zigbeeDeviceId: this.form.controls.device.value,
        executionTime: this.form.controls.time.value,
        daysOfWeek: this.form.value.daysOfWeek,
        action: { ...deviceAction, currentValue: payload[deviceAction?.key] },
      } as TaskAction);
    }
  }

  private _handleFormEvents(): void {
    this.form.controls.device.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value) => {
      if (value !== null) {
        this.form.controls.action.enable();
        this.form.controls.action.reset();
        this._setActions(value);
      } else {
        this.form.controls.action.disable();
        this.form.controls.action.reset();
      }
    });

    this.form.controls.action.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((key) => {
      this._setSelectedActions(key);
    });
  }

  private _setSelectedActions(key: string | null): void {
    this.selectedAction.set(this.actions().find((action) => action.key === key) ?? null);

    const action: DeviceAction | null = this.selectedAction();

    if (action) {
      this._patchActionPayload(action);
    }
  }

  private _setActions(deviceId: string): void {
    const device: AvailableDevice | undefined = this.devices().find((device) => device.id === deviceId);
    if (device) {
      this.actions.set(device.actions);
    } else {
      this.actions.set([]);
    }
  }

  private _patchActionPayload(action: DeviceAction): void {
    this.form.controls.payload.patchValue({
      [action.key]: action.currentValue ?? action.enumValues[0],
    });
  }
}
