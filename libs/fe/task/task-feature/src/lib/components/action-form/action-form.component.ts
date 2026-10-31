import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Injector,
  input,
  InputSignal,
  model,
  ModelSignal,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonDatetime, IonInput, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { AvailableDevice, TaskAction, TasksSignalStore, tasksSignalStore } from '@sparrow-home/task-domain';
import { DaysOfWeekControl, DeviceActionComponent, Divider } from '@sparrow-home/ui';
import { DeviceAction, humanize } from '@sparrow-home/utils';

import { ActionFormService } from './form-service/action-form.service';
import { ActionForm } from './form-service/model/action-form';

@Component({
  selector: 'sp-action-form',
  imports: [
    ReactiveFormsModule,
    DeviceActionComponent,
    DaysOfWeekControl,
    TranslatePipe,
    IonButton,
    IonInput,
    IonLabel,
    IonSelect,
    IonSelectOption,
    Divider,
    IonDatetime,
  ],
  templateUrl: './action-form.component.html',
  providers: [ActionFormService],
})
export class ActionFormComponent implements OnInit {
  public readonly taskAction: ModelSignal<TaskAction | undefined> = model();
  public readonly isLoading: InputSignal<boolean> = input(false);

  private readonly _store: TasksSignalStore = inject(tasksSignalStore);
  private readonly _formService: ActionFormService = inject(ActionFormService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _injector: Injector = inject(Injector);

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

    effect(
      () => {
        if (this.isLoading()) {
          this.form.disable();
        } else {
          this.form.enable({ emitEvent: false });
        }
      },
      { injector: this._injector }
    );
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

  protected formatTime(date: Date | null): string {
    if (!date) return '';
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  protected onTimeChange(value: string | string[] | null | undefined): void {
    if (typeof value !== 'string') return;

    const [hoursString, minutesString] = value.split(':');
    const hours: number = Number(hoursString);
    const minutes: number = Number(minutesString);

    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return;

    const base: Date = this.form.controls.time.value ?? new Date();
    const nextValue: Date = new Date(base);
    nextValue.setHours(hours, minutes, 0, 0);
    this.form.controls.time.setValue(nextValue);
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
