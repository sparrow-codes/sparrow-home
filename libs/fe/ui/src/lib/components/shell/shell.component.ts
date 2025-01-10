import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal, output, OutputEmitterRef, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { heroArrowLeftEndOnRectangleSolid } from '@ng-icons/heroicons/solid';
import { filter, map } from 'rxjs';

import { NavigationItem } from '../../models/navigation-item';
import { AppLogoComponent } from '../logo/app-logo.component';
import { AppHeaderComponent } from './header/app-header.component';
import { NavItemComponent } from './nav-item/nav-item.component';

@Component({
  selector: 'sp-shell',
  imports: [
    CommonModule,
    AppHeaderComponent,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    NavItemComponent,
    AppLogoComponent,
  ],
  templateUrl: './shell.component.html',
  providers: [provideIcons({ heroArrowLeftEndOnRectangleSolid })],
})
export class ShellComponent {
  public readonly applicationTitle: InputSignal<string> = input.required();
  public readonly logout: OutputEmitterRef<void> = output();
  public readonly navigationItems: InputSignal<NavigationItem[]> = input<NavigationItem[]>([]);

  private readonly router: Router = inject(Router);

  protected currentUrl: Signal<string | undefined> = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        return this.router.url;
      })
    )
  );

  protected readonly today: Date = new Date();
}
