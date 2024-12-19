import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { heroCloud, heroComputerDesktop } from '@ng-icons/heroicons/outline';

import { RoutePath } from '~core/enum/route-path';
import { DataFacadeService } from '~core/services/data-facade.service';
import { APP_TITLE } from '~core/tokens/app-title-token';

import { ShellComponent } from '../shell/shell.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, ShellComponent],
  templateUrl: './frame.component.html',
  providers: [provideIcons({ heroComputerDesktop, heroCloud })],
})
export class FrameComponent {
  protected readonly appTitle: string = inject(APP_TITLE);
  protected readonly routePath: typeof RoutePath = RoutePath;

  private readonly dataService: DataFacadeService = inject(DataFacadeService);

  protected logout(): void {
    this.dataService.logout();
  }
}
