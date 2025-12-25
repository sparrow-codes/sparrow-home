import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RoutePath } from '@sparrow-home/core';
import { PrimeIcons } from 'primeng/api';
import { filter, map } from 'rxjs';

import { NavigationItem } from '../../models/navigation-item';

@Component({
  selector: 'sp-mobile-frame',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './mobile-frame.component.html',
})
export class MobileFrameComponent {
  private readonly _translateService: TranslateService = inject(TranslateService);

  protected navigationItems: NavigationItem[] = [
    { label: this._translateService.instant('ui.navigation.main'), icon: PrimeIcons.HOME, routerLink: RoutePath.MAIN },
    {
      label: this._translateService.instant('ui.navigation.automation'),
      icon: PrimeIcons.PINTEREST,
      routerLink: RoutePath.AUTOMATION,
    },
    {
      label: this._translateService.instant('ui.navigation.settings'),
      icon: PrimeIcons.COG,
      routerLink: RoutePath.USER_PROFILE,
    },
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
