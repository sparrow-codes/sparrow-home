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
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NavigationItem } from '../../models/navigation-item';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink, ToastModule, SkeletonModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  public readonly applicationTitle: InputSignal<string> = input.required();
  public readonly logout: OutputEmitterRef<void> = output();
  public readonly navigationItems: InputSignal<NavigationItem[]> = input<NavigationItem[]>([]);
  protected currentUrl: Signal<string | undefined> = toSignal(
    inject(Router).events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url)
    )
  );
}
