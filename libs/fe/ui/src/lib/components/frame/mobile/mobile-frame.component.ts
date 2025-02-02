import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { IonContent, IonHeader, IonRouterLink, IonTabBar, IonTabButton, IonToolbar } from '@ionic/angular/standalone';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeftEndOnRectangle, heroComputerDesktop, heroLightBulb } from '@ng-icons/heroicons/outline';
import { matHeatPump } from '@ng-icons/material-icons/baseline';
import { APP_TITLE, DataFacadeService, RoutePath } from '@sparrow-home/core';
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
  providers: [provideIcons({ heroComputerDesktop, matHeatPump, heroLightBulb, heroArrowLeftEndOnRectangle })],
})
export class MobileFrameComponent {
  protected readonly appTitle: string = inject(APP_TITLE);
  protected readonly routePath: typeof RoutePath = RoutePath;
  protected navigationItems: NavigationItem[] = [
    { label: 'Panel Główny', icon: 'heroComputerDesktop', routerLink: this.routePath.MAIN },
    { label: 'Pompa Ciepła', icon: 'matHeatPump', routerLink: this.routePath.HEAT_PUMP },
    { label: 'Akwarium', icon: 'heroLightBulb', routerLink: this.routePath.AQUARIUM },
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

  protected readonly today: Date = new Date();

  protected logout(): void {
    this.dataService.logout();
  }
}
