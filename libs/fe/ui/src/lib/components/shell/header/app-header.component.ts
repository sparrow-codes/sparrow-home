import { CommonModule } from '@angular/common';
import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeftEndOnRectangleSolid, heroBars3Solid } from '@ng-icons/heroicons/solid';

import { NavigationItem } from '../../../models/navigation-item';
import { AppLogoComponent } from '../../logo/app-logo.component';
import { NavItemComponent } from '../nav-item/nav-item.component';

@Component({
  selector: 'sp-app-header',
  imports: [CommonModule, MatButton, NavItemComponent, NgIcon, AppLogoComponent],
  templateUrl: './app-header.component.html',
  providers: [provideIcons({ heroArrowLeftEndOnRectangleSolid, heroBars3Solid })],
})
export class AppHeaderComponent {
  public readonly logout: OutputEmitterRef<void> = output();
  public readonly openLeftMenu: OutputEmitterRef<void> = output();
  public readonly navigationItems: InputSignal<NavigationItem[]> = input<NavigationItem[]>([]);
  public readonly currentUrl: InputSignal<string> = input<string>('');
}
