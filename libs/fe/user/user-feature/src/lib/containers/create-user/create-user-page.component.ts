import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { APP_TITLE } from '@sparrow-home/core';
import { staggeredFadeIn } from '@sparrow-home/ui';
import { UserDataFacadeService } from '@sparrow-home/user-domain';
import { Card } from 'primeng/card';

import { CreateUserFormComponent } from '../../component/create-user-form/create-user-form.component';

@Component({
  imports: [CommonModule, CreateUserFormComponent, Card, TranslatePipe],
  animations: [staggeredFadeIn],
  templateUrl: './create-user-page.component.html',
})
export class CreateUserPageComponent {
  protected readonly dataService: UserDataFacadeService = inject(UserDataFacadeService);
  protected readonly appTitle: string = inject(APP_TITLE);
}
