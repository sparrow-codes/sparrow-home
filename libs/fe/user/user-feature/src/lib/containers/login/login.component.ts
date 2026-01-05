import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDataFacadeService } from '@sparrow-home/user-domain';
import { first, Observable } from 'rxjs';

import { LoginFormComponent } from '../../component/login-form/login-form.component';

@Component({
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router: Router = inject(Router);

  protected createNewUserLink: string = '';
  protected readonly dataService: UserDataFacadeService = inject(UserDataFacadeService);
  protected readonly isLoading$: Observable<boolean> = this.dataService.isLoading$;

  public ngOnInit(): void {
    this.dataService.logout();

    this._activatedRoute.data.pipe(first()).subscribe((data) => {
      this.createNewUserLink = data['createNewUserLink'];
    });
  }

  protected navigateToNewUser(): void {
    this._router.navigate([this.createNewUserLink]);
  }
}
