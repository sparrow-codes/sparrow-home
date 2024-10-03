import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CardComponent, sparrowFadeIn } from '@sparrow-codes/sparrow-ui';

import { DataFacadeService } from '~core/services/data-facade.service';
import { APP_TITLE } from '~core/tokens/app-title-token';
import { LoginFormComponent } from '~user/component/login-form/login-form.component';

@Component({
  standalone: true,
  imports: [CommonModule, CardComponent, LoginFormComponent],
  templateUrl: './login.component.html',
  animations: [sparrowFadeIn],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  protected readonly appTitle: string = inject(APP_TITLE);
  protected readonly dataService: DataFacadeService = inject(DataFacadeService);

  public ngOnInit(): void {
    this.dataService.logout();
  }
}
