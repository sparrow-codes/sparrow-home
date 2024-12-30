import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { APP_TITLE, DataFacadeService } from '@sparrow-home/core';
import { sparrowFadeIn } from '@sparrow-home/ui';

import { LoginFormComponent } from '../../component/login-form/login-form.component';

@Component({
  imports: [CommonModule, LoginFormComponent, MatCard, MatCardHeader, MatCardTitle],
  templateUrl: './login.component.html',
  animations: [sparrowFadeIn],
})
export class LoginComponent implements OnInit {
  protected readonly appTitle: string = inject(APP_TITLE);
  protected readonly dataService: DataFacadeService = inject(DataFacadeService);

  public ngOnInit(): void {
    this.dataService.logout();
  }
}
