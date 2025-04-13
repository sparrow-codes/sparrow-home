import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { AppLogoComponent, sparrowFadeIn } from '@sparrow-home/ui';
import { UserDataFacadeService } from '@sparrow-home/user-domain';
import { first } from 'rxjs';

import { LoginFormComponent } from '../../component/login-form/login-form.component';

@Component({
  imports: [CommonModule, LoginFormComponent, MatCard, AppLogoComponent],
  templateUrl: './login.component.html',
  animations: [sparrowFadeIn],
})
export class LoginComponent implements OnInit {
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  protected createNewUserLink: string = '';
  protected readonly dataService: UserDataFacadeService = inject(UserDataFacadeService);

  public ngOnInit(): void {
    this.dataService.logout();

    this._activatedRoute.data.pipe(first()).subscribe((data) => {
      this.createNewUserLink = data['createNewUserLink'];
    });
  }
}
