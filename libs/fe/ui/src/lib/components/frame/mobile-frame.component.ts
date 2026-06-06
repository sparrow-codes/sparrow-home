import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map } from 'rxjs';

import { NavigationItem } from '../../models/navigation-item';

@Component({
  selector: 'sp-mobile-frame',
  imports: [RouterOutlet, RouterLink, TranslatePipe, NgIcon, RouterLinkActive],
  templateUrl: './mobile-frame.component.html',
})
export class MobileFrameComponent {
  private readonly _router: Router = inject(Router);
  private readonly _activeRoute: ActivatedRoute = inject(ActivatedRoute);

  protected readonly navigationItems: NavigationItem[] = this._activeRoute.snapshot.data['navigationItems'];

  protected currentUrl: Signal<string | undefined> = toSignal(
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        return this._router.url;
      })
    )
  );
}
