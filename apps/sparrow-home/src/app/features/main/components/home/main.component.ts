import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { RootDataFacadeService } from '../../../../core/services/root-data-facade.service';
import { PageTitleComponent } from '../../../../ui/components/page-title/page-title.component';

@Component({
  standalone: true,
  imports: [CommonModule, PageTitleComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
  private readonly rootDataService = inject(RootDataFacadeService);

  public ngOnInit(): void {
      this.rootDataService.fetchWifiDeviceList();
  }
}
