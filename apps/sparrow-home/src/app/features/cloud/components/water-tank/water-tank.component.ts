import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroAdjustmentsHorizontal, heroNoSymbol } from '@ng-icons/heroicons/outline';
import { heroCheckCircleSolid } from '@ng-icons/heroicons/solid';
import { LabelComponent, SwitchComponent } from '@sparrow-codes/sparrow-ui';

import { TankStatus } from '~api/cloud/models/get-heat-pump-details-response';
import { WaterTankOptions } from '~core/models/water-tank-options';

import { WaterTankFormName } from './form-service/enum/water-tank-form-name';
import { WaterTankForm } from './form-service/model/water-tank-form';
import { WaterTankFormService } from './form-service/water-tank-form.service';

@Component({
  selector: 'app-water-tank',
  standalone: true,
  imports: [CommonModule, NgIconComponent, LabelComponent, SwitchComponent, ReactiveFormsModule],
  templateUrl: './water-tank.component.html',
  providers: [provideIcons({ heroCheckCircleSolid, heroNoSymbol, heroAdjustmentsHorizontal }), WaterTankFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaterTankComponent implements OnInit {
  public readonly waterTank: InputSignal<TankStatus> = input.required();
  public readonly onWaterTankOptionsChange: OutputEmitterRef<WaterTankOptions> = output();
  public readonly onLongBathChange: OutputEmitterRef<boolean> = output();
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
      .subscribe((value) => this.onWaterTankOptionsChange.emit({ isScheduledHeating: value }));
  }

  private _handleLongBathChange(): void {
    this.formService.longBathControl.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => this.onLongBathChange.emit(value));
  }
}
