import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';

import { NavigationItem } from '../../models/navigation-item';
import { DesktopNavigationComponent } from './desktop-navigation/desktop-navigation.component';

@Component({
  selector: 'sp-mobile-frame',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, NgIcon, IonTabs, IonTabBar, IonTabButton, DesktopNavigationComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './mobile-frame.component.html',
  styleUrl: './mobile-frame.component.scss',
})
export class MobileFrameComponent {
  protected readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  protected readonly navigationItems: NavigationItem[] = this.activeRoute.snapshot.data['navigationItems'];
}
