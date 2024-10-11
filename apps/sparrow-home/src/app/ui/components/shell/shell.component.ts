import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeftEndOnRectangleSolid } from '@ng-icons/heroicons/solid';
import { ButtonComponent } from '@sparrow-codes/sparrow-ui';
import { filter, map } from 'rxjs';

import { NavigationItem } from '../../models/navigation-item';
import { NavItemComponent } from './nav-item/nav-item.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, NgIcon, NavItemComponent],
  templateUrl: './shell.component.html',
  providers: [provideIcons({ heroArrowLeftEndOnRectangleSolid })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  public readonly lowestTemperatureAtNight: InputSignal<number | undefined> = input();
  public readonly applicationTitle: InputSignal<string> = input.required();
  public readonly logout: OutputEmitterRef<void> = output();
  public readonly navigationItems: InputSignal<NavigationItem[]> = input<NavigationItem[]>([]);

  protected currentUrl: Signal<string | undefined> = toSignal(
    inject(Router).events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url)
    )
  );
  protected readonly today: Date = new Date();
}
