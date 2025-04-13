import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { bootstrapBellFill } from '@ng-icons/bootstrap-icons';
import { provideIcons } from '@ng-icons/core';
import { heroComputerDesktop, heroLightBulb } from '@ng-icons/heroicons/outline';
import { matHeatPump } from '@ng-icons/material-icons/baseline';
import { APP_TITLE, RoutePath } from '@sparrow-home/core';
import { UserDataFacadeService } from '@sparrow-home/user-domain';

import { ShellComponent } from '../../shell/shell.component';

@Component({
  imports: [CommonModule, RouterOutlet, ShellComponent],
  templateUrl: './frame.component.html',
  providers: [provideIcons({ heroComputerDesktop, matHeatPump, heroLightBulb, bootstrapBellFill })],
})
export class FrameComponent {
  protected readonly appTitle: string = inject(APP_TITLE);
  protected readonly routePath: typeof RoutePath = RoutePath;

  private readonly dataService: UserDataFacadeService = inject(UserDataFacadeService);

  protected logout(): void {
    this.dataService.logout();
  }
}
