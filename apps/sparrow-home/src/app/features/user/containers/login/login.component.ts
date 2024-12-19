import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

import { DataFacadeService } from '~core/services/data-facade.service';
import { APP_TITLE } from '~core/tokens/app-title-token';
import { LoginFormComponent } from '~user/component/login-form/login-form.component';

@Component({
  imports: [CommonModule, LoginFormComponent, MatCard, MatCardHeader, MatCardTitle, MatCardContent],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  protected readonly appTitle: string = inject(APP_TITLE);
  protected readonly dataService: DataFacadeService = inject(DataFacadeService);

  public ngOnInit(): void {
    this.dataService.logout();
  }
}
