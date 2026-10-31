import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent } from '@ionic/angular';
import { APP_TITLE } from '@sparrow-home/core';
import { UserDataFacadeService } from '@sparrow-home/user-domain';
import { first, Observable } from 'rxjs';

import { LoginFormComponent } from '../../component/login-form/login-form.component';

@Component({
  imports: [CommonModule, LoginFormComponent, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent],
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  protected createNewUserLink: string = '';
  protected readonly dataService: UserDataFacadeService = inject(UserDataFacadeService);
  protected readonly isLoading$: Observable<boolean> = this.dataService.isLoading$;
  protected readonly appTitle: string = inject(APP_TITLE);

  public ngOnInit(): void {
    this.dataService.logout();

    this._activatedRoute.data.pipe(first()).subscribe((data) => {
      this.createNewUserLink = data['createNewUserLink'];
    });
  }
}
