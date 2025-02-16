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
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { bootstrapThermometerHalf } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPresentationChartLine } from '@ng-icons/heroicons/outline';
import { matWaterDrop } from '@ng-icons/material-icons/baseline';
import {
  CircularPumpPreferences,
  HeatingPreferences,
  HeatPump,
  HeatPumpFacadeService,
  WaterTankOptions,
} from '@sparrow-home/heat-pump-domain';
import { LayoutService, PageTitleComponent, SelectOption } from '@sparrow-home/ui';

import { CircularPumpSettingsComponent } from '../../components/circular-pump-settings/circular-pump-settings.component';
import { HeatTankComponent } from '../../components/heat-tank/heat-tank.component';
import { HeatingSettingsComponent } from '../../components/heating-settings/heating-settings.component';
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
    PageTitleComponent,
    MatTabGroup,
    MatTab,
    CircularPumpSettingsComponent,
    HeatingSettingsComponent,
  ],
  templateUrl: './cloud-container.component.html',
  providers: [provideIcons({ heroPresentationChartLine, bootstrapThermometerHalf, matWaterDrop }), CloudFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloudContainerComponent implements OnInit {
  protected formGroup?: FormGroup<CloudForm>;

  protected readonly formName: typeof CloudFormName = CloudFormName;
  protected readonly dataFacadeService: HeatPumpFacadeService = inject(HeatPumpFacadeService);
  protected readonly heatPump: Signal<HeatPump | null> = this.dataFacadeService.heatPump;
  protected readonly waterTankOptions: Signal<WaterTankOptions | null> = this.dataFacadeService.waterTankOptions;
  protected readonly circularPumpPreferences: Signal<CircularPumpPreferences | null> =
    this.dataFacadeService.circularPumpPreferences;
  protected readonly homeDeviceOptions: Signal<{ value: string; label: string }[] | null> =
    this.dataFacadeService.homeDeviceOptions;
  protected readonly heatingPreferences: Signal<HeatingPreferences | null> = this.dataFacadeService.heatingPreferences;
  protected readonly temperatureSensorsOptions: Signal<SelectOption<number>[] | null> =
    this.dataFacadeService.temperatureSensorsOptions;
  protected readonly layoutService: LayoutService = inject(LayoutService);

  private readonly _injector: Injector = inject(Injector);
  private readonly _formService: CloudFormService = inject(CloudFormService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.dataFacadeService.fetchInitData();

    effect(
      () => {
        const heatPump: HeatPump | null = this.heatPump();

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

  protected setCircularPumpPreferences(preferences: CircularPumpPreferences): void {
    this.dataFacadeService.setCircularPumpPreferences(preferences);
  }

  protected setCircularPumScheduled(isActive: boolean): void {
    this.dataFacadeService.setCircularPumpScheduleStatus(isActive);
  }

  protected setHeatPreferences(heatPreferences: HeatingPreferences): void {
    this.dataFacadeService.setHeatingPreferences(heatPreferences);
  }

  protected changeAutomaticHeatingStatus(isAutomatic: boolean): void {
    this.dataFacadeService.activateAutomaticHeating(isAutomatic);
  }

  private _createCloudForm(heatPump: HeatPump): void {
    this._formService.prepareForm(!!heatPump.waterTank?.operationStatus, !!heatPump.heatTank?.operationStatus);
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
