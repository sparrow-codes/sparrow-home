import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { DataFacadeService } from '@sparrow-home/core';
import { AppLogoComponent, sparrowFadeIn } from '@sparrow-home/ui';

import { LoginFormComponent } from '../../component/login-form/login-form.component';

@Component({
  imports: [CommonModule, LoginFormComponent, MatCard, AppLogoComponent],
  templateUrl: './login.component.html',
  animations: [sparrowFadeIn],
})
export class LoginComponent implements OnInit {
  protected readonly dataService: DataFacadeService = inject(DataFacadeService);

  public ngOnInit(): void {
    this.dataService.logout();
  }
}
