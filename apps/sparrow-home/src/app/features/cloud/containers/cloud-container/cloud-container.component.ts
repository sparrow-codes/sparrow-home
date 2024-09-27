import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroClock, heroPresentationChartLine } from '@ng-icons/heroicons/outline';
import { HeatPump } from '@shared-models/panasonic-cloud-models';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';

import { RootDataFacadeService } from '../../../../core/services/root-data-facade.service';
import { PageTitleComponent } from '../../../../ui/components/page-title/page-title.component';
import { HeatPumpComponent } from '../../components/heat-pump/heat-pump.component';

@Component({
  standalone: true,
  imports: [PageTitleComponent, ProgressSpinnerModule, TabViewModule, NgIconComponent, TableModule, HeatPumpComponent],
  templateUrl: './cloud-container.component.html',
  styleUrl: './cloud-container.component.css',
  providers: [provideIcons({ heroPresentationChartLine, heroClock })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloudContainerComponent implements OnInit {
  protected readonly rootDataService: RootDataFacadeService = inject(RootDataFacadeService);
  protected readonly heatPump: Signal<HeatPump | null> = this.rootDataService.heatPump;
  protected readonly isLoading: Signal<boolean> = this.rootDataService.isLoading;

  public ngOnInit(): void {
    this.rootDataService.connectToCloudServices();
  }
}
