import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { heroCloud, heroComputerDesktop, heroLightBulb } from '@ng-icons/heroicons/outline';
import { APP_TITLE, DataFacadeService, RoutePath } from '@sparrow-home/core';

import { ShellComponent } from '../shell/shell.component';

@Component({
  imports: [CommonModule, RouterOutlet, ShellComponent],
  templateUrl: './frame.component.html',
  providers: [provideIcons({ heroComputerDesktop, heroCloud, heroLightBulb })],
})
export class FrameComponent {
  protected readonly appTitle: string = inject(APP_TITLE);
  protected readonly routePath: typeof RoutePath = RoutePath;

  private readonly dataService: DataFacadeService = inject(DataFacadeService);

  protected logout(): void {
    this.dataService.logout();
  }
}
