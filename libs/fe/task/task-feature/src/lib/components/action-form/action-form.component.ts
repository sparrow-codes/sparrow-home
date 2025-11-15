import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppStore, appStore } from '@sparrow-home/core';
import { AvailableDevice, TaskAction } from '@sparrow-home/task-domain';
import { DeviceActionComponent, spFadeInAnimation } from '@sparrow-home/ui';
import { DeviceAction } from '@sparrow-home/utils';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Divider } from 'primeng/divider';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';

import { ActionFormService } from './form-service/action-form.service';
import { ActionForm } from './form-service/model/action-form';

@Component({
  selector: 'sp-action-form',
  imports: [CommonModule, Select, ReactiveFormsModule, DeviceActionComponent, DatePicker, FloatLabel, Button, Divider],
  templateUrl: './action-form.component.html',
  animations: [spFadeInAnimation],
  providers: [ActionFormService],
})
export class ActionFormComponent implements OnInit {
  private readonly _store: AppStore = inject(appStore);
  private readonly _formService: ActionFormService = inject(ActionFormService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _dialog: DynamicDialogRef = inject(DynamicDialogRef);
  private readonly _dialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);

  protected readonly form: FormGroup<ActionForm> = this._formService.form;
  protected readonly devices: Signal<AvailableDevice[]> = this._store.availableDevices;
  protected readonly actions: WritableSignal<DeviceAction[]> = signal([]);
  protected readonly selectedAction: WritableSignal<DeviceAction | null> = signal(null);

  public ngOnInit(): void {
    const dialogData: TaskAction | undefined = this._dialogConfig.data;
    console.log(dialogData);

    if (dialogData) {
      this.form.patchValue({
        time: dialogData.executionTime,
        device: dialogData.zigbeeDeviceId,
        action: dialogData.action.key,
        payload: {
          [dialogData.action.key]: dialogData.action.currentValue,
        },
      });

      this._setActions(dialogData.zigbeeDeviceId);
      this.selectedAction.set(dialogData.action);
      this.form.controls.payload.patchValue({ [dialogData.action.key]: dialogData.action.currentValue });
    }

    this._handleFormEvents();
  }

  protected save(): void {
    if (this.form.invalid) return;

    const deviceAction: DeviceAction | null = this.selectedAction();
    const payload: Record<string, unknown> | null = this.form.controls.payload.value;

    if (deviceAction && payload) {
      this._dialog.close({
        zigbeeDeviceId: this.form.controls.device.value,
        executionTime: this.form.controls.time.value,
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
      this.form.controls.payload.patchValue({ [action.key]: action.currentValue });
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
}
