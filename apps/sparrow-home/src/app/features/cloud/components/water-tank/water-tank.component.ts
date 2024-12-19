import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, InputSignal, OnInit, output, OutputEmitterRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroAdjustmentsHorizontal, heroNoSymbol } from '@ng-icons/heroicons/outline';
import { heroCheckCircleSolid } from '@ng-icons/heroicons/solid';
import { TankStatus } from '@sparrow-home/api';

import { WaterTankOptions } from '../../../../core/models/water-tank-options';
import { WaterTankFormName } from './form-service/enum/water-tank-form-name';
import { WaterTankForm } from './form-service/model/water-tank-form';
import { WaterTankFormService } from './form-service/water-tank-form.service';

@Component({
  selector: 'app-water-tank',
  imports: [CommonModule, NgIconComponent, ReactiveFormsModule, MatSlideToggle],
  templateUrl: './water-tank.component.html',
  providers: [provideIcons({ heroCheckCircleSolid, heroNoSymbol, heroAdjustmentsHorizontal }), WaterTankFormService],
})
export class WaterTankComponent implements OnInit {
  public readonly waterTank: InputSignal<TankStatus> = input.required();
  public readonly waterTankOptionsChange: OutputEmitterRef<WaterTankOptions> = output();
  public readonly waterTankOptions: InputSignal<WaterTankOptions | null> = input.required();

  protected readonly formService: WaterTankFormService = inject(WaterTankFormService);
  protected readonly formGroup: FormGroup<WaterTankForm> = this.formService.form;
  protected readonly formName: typeof WaterTankFormName = WaterTankFormName;

  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.formService.scheduleWaterHeatingControl.setValue(this.waterTankOptions()?.isScheduledHeating ?? false, {
      emitEvent: false,
    });

    this._handleScheduleWaterHeatingChange();
  }

  private _handleScheduleWaterHeatingChange(): void {
    this.formService.scheduleWaterHeatingControl.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => this.waterTankOptionsChange.emit({ isScheduledHeating: value }));
  }
}
