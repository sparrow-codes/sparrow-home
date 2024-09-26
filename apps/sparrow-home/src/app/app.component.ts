import { ChangeDetectionStrategy, Component, computed, inject, InputSignal, OnInit, Signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { ShellComponent } from './ui/components/shell/shell.component';
import { APP_TITLE } from './core/tokens/app-title-token';
import { RoutePath } from './app.routes';


@Component({
  standalone: true,
  imports: [RouterModule, ShellComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  protected readonly appTitle: string = inject(APP_TITLE);
  protected readonly routePath: typeof RoutePath = RoutePath;

  private readonly primeNgConfig: PrimeNGConfig = inject(PrimeNGConfig);

  public ngOnInit(): void {
      this.primeNgConfig.ripple = true;
  }
}
