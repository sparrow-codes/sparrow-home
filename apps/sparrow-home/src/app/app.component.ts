import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

import { RoutePath } from './app.routes';
import { APP_TITLE } from './core/tokens/app-title-token';
import { ShellComponent } from './ui/components/shell/shell.component';

@Component({
  standalone: true,
  imports: [RouterModule, ShellComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  protected readonly appTitle: string = inject(APP_TITLE);
  protected readonly routePath: typeof RoutePath = RoutePath;

  private readonly primeNgConfig: PrimeNGConfig = inject(PrimeNGConfig);

  public ngOnInit(): void {
    this.primeNgConfig.ripple = true;
  }
}
