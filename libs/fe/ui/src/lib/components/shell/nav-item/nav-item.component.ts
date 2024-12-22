import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

import { NavigationItem } from '../../../models/navigation-item';

@Component({
  selector: 'sp-nav-item',
  imports: [CommonModule, NgIcon, RouterLink],
  templateUrl: './nav-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavItemComponent {
  public readonly navItem: InputSignal<NavigationItem> = input.required();
  public readonly currentUrl: InputSignal<string | undefined> = input();
}
