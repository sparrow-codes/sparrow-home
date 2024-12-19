import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  Injector,
  OnInit,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroClock, heroPresentationChartLine } from '@ng-icons/heroicons/outline';

import { GetHeatPumpDetailsResponse } from '~api/cloud/models/get-heat-pump-details-response';
import { WaterTankOptions } from '~core/models/water-tank-options';
import { DataFacadeService } from '~core/services/data-facade.service';
import { PageTitleComponent } from '~ui/components/page-title/page-title.component';

import { HeatTankComponent } from '../../components/heat-tank/heat-tank.component';
import { WaterTankComponent } from '../../components/water-tank/water-tank.component';
import { CloudFormService } from './form-service/cloud-form.service';
import { CloudFormName } from './form-service/enum/cloud-form-name';
import { CloudForm } from './form-service/model/cloud-form';

@Component({
  standalone: true,
  imports: [
    PageTitleComponent,
    NgIconComponent,
    WaterTankComponent,
    HeatTankComponent,
    ReactiveFormsModule,
    MatSlideToggle,
    MatCardModule,
  ],
  templateUrl: './cloud-container.component.html',
  providers: [provideIcons({ heroPresentationChartLine, heroClock }), CloudFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloudContainerComponent implements OnInit {
  protected formGroup?: FormGroup<CloudForm>;

  protected readonly formName: typeof CloudFormName = CloudFormName;
  protected readonly dataFacadeService: DataFacadeService = inject(DataFacadeService);
  protected readonly heatPump: Signal<GetHeatPumpDetailsResponse | null> = this.dataFacadeService.heatPump;
  protected readonly waterTankOptions: Signal<WaterTankOptions | null> = this.dataFacadeService.waterTankOptions;

  private readonly _injector: Injector = inject(Injector);
  private readonly _formService: CloudFormService = inject(CloudFormService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.dataFacadeService.getHeatPumpDetails();

    effect(
      () => {
        const heatPump: GetHeatPumpDetailsResponse | null = this.heatPump();

        if (heatPump && !this.formGroup) {
          this._createCloudForm(heatPump);
        }
      },
      { injector: this._injector }
    );
  }

  protected handleWaterTankOptionsChange(waterTankOptions: WaterTankOptions): void {
    this.dataFacadeService.changeScheduledWaterHeatingStatus(waterTankOptions.isScheduledHeating);
  }

  private _createCloudForm(heatPump: GetHeatPumpDetailsResponse): void {
    this._formService.prepareForm(!!heatPump.tankStatus?.operationStatus, !!heatPump.zoneStatus?.operationStatus);
    this.formGroup = this._formService.form;
    this.formGroup?.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((value) =>
        this.dataFacadeService.setHeatPumpOperationStatus(
          value[CloudFormName.IS_WATER_ON] ?? false,
          value[CloudFormName.IS_HEAT_ON] ?? false
        )
      );
  }
}
