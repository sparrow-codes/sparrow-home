import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeftCircle } from '@ng-icons/heroicons/outline';
import { AppLogoComponent, sparrowFadeIn } from '@sparrow-home/ui';
import { UserDataFacadeService } from '@sparrow-home/user-domain';

import { CreateUserFormComponent } from '../../component/create-user-form/create-user-form.component';

@Component({
  selector: 'sp-create-additional-user',
  imports: [
    CommonModule,
    CreateUserFormComponent,
    MatCard,
    MatCardContent,
    AppLogoComponent,
    MatButton,
    NgIcon,
    RouterLink,
  ],
  templateUrl: './create-additional-user.component.html',
  animations: [sparrowFadeIn],
  providers: [provideIcons({ heroArrowLeftCircle })],
})
export class CreateAdditionalUserComponent implements OnInit {
  protected loginPath: string = '';
  protected readonly dataService: UserDataFacadeService = inject(UserDataFacadeService);

  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public ngOnInit(): void {
    this.loginPath = this._activatedRoute.snapshot.data['loginPath'];
  }
}
