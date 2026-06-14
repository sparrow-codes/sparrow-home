import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';

import { NavigationItem } from '../../models/navigation-item';

@Component({
  selector: 'sp-mobile-frame',
  imports: [RouterOutlet, RouterLink, TranslatePipe, NgIcon, RouterLinkActive],
  templateUrl: './mobile-frame.component.html',
})
export class MobileFrameComponent {
  private readonly _activeRoute: ActivatedRoute = inject(ActivatedRoute);

  protected readonly navigationItems: NavigationItem[] = this._activeRoute.snapshot.data['navigationItems'];
}
