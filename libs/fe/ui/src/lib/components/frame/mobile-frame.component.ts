import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';

import { NavigationItem } from '../../models/navigation-item';

@Component({
  selector: 'sp-mobile-frame',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, NgIcon, IonTabs, IonTabBar, IonTabButton],
  templateUrl: './mobile-frame.component.html',
})
export class MobileFrameComponent {
  protected readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  protected readonly navigationItems: NavigationItem[] = this.activeRoute.snapshot.data['navigationItems'];
}
