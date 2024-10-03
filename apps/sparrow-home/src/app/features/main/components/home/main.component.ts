import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ButtonComponent, SpToastService } from '@sparrow-codes/sparrow-ui';

import { DataFacadeService } from '~core/services/data-facade.service';

import { PageTitleComponent } from '../../../../ui/components/page-title/page-title.component';

@Component({
  standalone: true,
  imports: [CommonModule, PageTitleComponent, ButtonComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
  private readonly rootDataService = inject(DataFacadeService);
  protected readonly toastMessage: SpToastService = inject(SpToastService);

  public ngOnInit(): void {
    this.rootDataService.fetchWifiDeviceList();
  }
}
