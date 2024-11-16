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
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroAdjustmentsHorizontal, heroNoSymbol } from '@ng-icons/heroicons/outline';
import { heroCheckCircleSolid } from '@ng-icons/heroicons/solid';
import { LabelComponent, SwitchComponent } from '@sparrow-codes/sparrow-ui';

import { ZoneStatus } from '~api/cloud/models/get-heat-pump-details-response';

import { HeatTankFormName } from './form-service/enum/heat-tank-form-name';
import { HeatTankFormService } from './form-service/heat-tank-form.service';

@Component({
  selector: 'app-heat-tank',
  standalone: true,
  imports: [NgIcon, ReactiveFormsModule, LabelComponent, SwitchComponent],
  templateUrl: './heat-tank.component.html',
  providers: [provideIcons({ heroCheckCircleSolid, heroNoSymbol, heroAdjustmentsHorizontal }), HeatTankFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeatTankComponent implements OnInit {
  public readonly zone: InputSignal<ZoneStatus> = input.required();
  public readonly onHeatOverNightChange: OutputEmitterRef<boolean> = output();

  protected readonly formService: HeatTankFormService = inject(HeatTankFormService);
  protected readonly formGroup: FormGroup = this.formService.form;
  protected readonly formName: typeof HeatTankFormName = HeatTankFormName;

  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this._handleHeatOverNightChange();
  }

  private _handleHeatOverNightChange(): void {
    this.formService.heatOverNightControl.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => this.onHeatOverNightChange.emit(value));
  }
}
