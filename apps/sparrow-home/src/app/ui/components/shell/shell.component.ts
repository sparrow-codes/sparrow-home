import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal, output, OutputEmitterRef, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { NavigationEnd, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeftEndOnRectangleSolid } from '@ng-icons/heroicons/solid';
import { filter, map } from 'rxjs';

import { NavigationItem } from '../../models/navigation-item';
import { NavItemComponent } from './nav-item/nav-item.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, NgIcon, NavItemComponent, MatButton],
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
