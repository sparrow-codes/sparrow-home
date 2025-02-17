import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { IonContent, IonHeader, IonRouterLink, IonTabBar, IonTabButton, IonToolbar } from '@ionic/angular/standalone';
import { bootstrapBellFill } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeftEndOnRectangle, heroComputerDesktop, heroLightBulb } from '@ng-icons/heroicons/outline';
import { matHeatPump } from '@ng-icons/material-icons/baseline';
import { DataFacadeService, RoutePath } from '@sparrow-home/core';
import { filter, map } from 'rxjs';

import { NavigationItem } from '../../../models/navigation-item';
import { AppLogoComponent } from '../../logo/app-logo.component';

@Component({
  selector: 'sp-mobile-frame',
  imports: [
    CommonModule,
    IonHeader,
    IonContent,
    IonToolbar,
    AppLogoComponent,
    RouterOutlet,
    IonTabBar,
    IonTabButton,
    NgIcon,
    RouterLink,
    MatButton,
    IonRouterLink,
  ],
  templateUrl: './mobile-frame.component.html',
  styleUrl: './mobile-frame.component.css',
  providers: [
    provideIcons({ heroComputerDesktop, matHeatPump, heroLightBulb, heroArrowLeftEndOnRectangle, bootstrapBellFill }),
  ],
})
export class MobileFrameComponent {
  protected navigationItems: NavigationItem[] = [
    { label: 'Panel Główny', icon: 'heroComputerDesktop', routerLink: RoutePath.MAIN },
    { label: 'Pompa Ciepła', icon: 'matHeatPump', routerLink: RoutePath.HEAT_PUMP },
    { label: 'Akwarium', icon: 'heroLightBulb', routerLink: RoutePath.AQUARIUM },
    { label: 'Alarm', icon: 'bootstrapBellFill', routerLink: RoutePath.ALARM },
  ];

  private readonly router: Router = inject(Router);
  private readonly dataService: DataFacadeService = inject(DataFacadeService);

  protected currentUrl: Signal<string | undefined> = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        return this.router.url;
      })
    )
  );

  protected logout(): void {
    this.dataService.logout();
  }
}
