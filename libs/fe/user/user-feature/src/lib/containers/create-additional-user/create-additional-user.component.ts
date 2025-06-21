import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { staggeredFadeIn } from '@sparrow-home/ui';
import { UserDataFacadeService } from '@sparrow-home/user-domain';
import { Button } from 'primeng/button';

import { CreateUserFormComponent } from '../../component/create-user-form/create-user-form.component';

@Component({
  selector: 'sp-create-additional-user',
  imports: [CommonModule, CreateUserFormComponent, Button],
  templateUrl: './create-additional-user.component.html',
  animations: [staggeredFadeIn],
})
export class CreateAdditionalUserComponent implements OnInit {
  private readonly _router: Router = inject(Router);
  protected loginPath: string = '';
  protected readonly dataService: UserDataFacadeService = inject(UserDataFacadeService);

  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public ngOnInit(): void {
    this.loginPath = this._activatedRoute.snapshot.data['loginPath'];
  }

  protected navigateToLogin(): void {
    this._router.navigate([this.loginPath]);
  }
}
