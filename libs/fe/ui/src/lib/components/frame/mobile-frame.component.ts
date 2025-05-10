import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { IonContent, IonHeader, IonRouterLink, IonTabBar, IonTabButton, IonToolbar } from '@ionic/angular/standalone';
import { bootstrapBellFill } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroComputerDesktop, heroLightBulb } from '@ng-icons/heroicons/outline';
import { matHeatPump, matSettings } from '@ng-icons/material-icons/baseline';
import { RoutePath } from '@sparrow-home/core';
import { filter, first, map } from 'rxjs';

import { NavigationItem } from '../../models/navigation-item';
import { AppLogoComponent } from '../logo/app-logo.component';

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
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
  templateUrl: './mobile-frame.component.html',
  styleUrl: './mobile-frame.component.css',
  providers: [provideIcons({ heroComputerDesktop, matHeatPump, heroLightBulb, matSettings, bootstrapBellFill })],
})
export class MobileFrameComponent implements OnInit {
  protected loginPath: string = '';
  protected profilePath: string = '';

  protected navigationItems: NavigationItem[] = [
    { label: 'Panel Główny', icon: 'heroComputerDesktop', routerLink: RoutePath.MAIN },
    { label: 'Akwarium', icon: 'heroLightBulb', routerLink: RoutePath.AQUARIUM },
    { label: 'Alarm', icon: 'bootstrapBellFill', routerLink: RoutePath.ALARM },
  ];

  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router: Router = inject(Router);

  public ngOnInit(): void {
    this._activatedRoute.data.pipe(first()).subscribe((data) => {
      this.loginPath = data['loginPath'];
      this.profilePath = data['profilePath'];
    });
  }

  protected currentUrl: Signal<string | undefined> = toSignal(
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        return this._router.url;
      })
    )
  );
}
