import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';

import { NavigationItem } from '../../../models/navigation-item';

@Component({
  selector: 'sp-desktop-navigation',
  imports: [RouterLink, RouterLinkActive, NgIcon, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './desktop-navigation.component.html',
  styleUrl: './desktop-navigation.component.scss',
})
export class DesktopNavigationComponent {
  public readonly navigationItems = input.required<NavigationItem[]>();
}
