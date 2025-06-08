import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { IonContent, IonHeader, IonTabBar, IonTabButton } from '@ionic/angular/standalone';
import { RoutePath } from '@sparrow-home/core';
import { PrimeIcons } from 'primeng/api';
import { filter, map } from 'rxjs';

import { NavigationItem } from '../../models/navigation-item';

@Component({
  selector: 'sp-mobile-frame',
  imports: [CommonModule, IonHeader, IonContent, RouterOutlet, IonTabBar, IonTabButton, RouterLink],
  templateUrl: './mobile-frame.component.html',
  styleUrl: './mobile-frame.component.css',
})
export class MobileFrameComponent {
  protected navigationItems: NavigationItem[] = [
    { label: 'Panel Główny', icon: PrimeIcons.HOME, routerLink: RoutePath.MAIN },
    { label: 'Automatyka', icon: PrimeIcons.PINTEREST, routerLink: RoutePath.AQUARIUM },
    { label: 'Ustawienia', icon: PrimeIcons.COG, routerLink: RoutePath.USER_PROFILE },
  ];

  private readonly _router: Router = inject(Router);

  protected currentUrl: Signal<string | undefined> = toSignal(
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        return this._router.url;
      })
    )
  );
}
