import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonContent,
  IonHeader,
  IonToolbar,
} from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { APP_TITLE } from '@sparrow-home/core';
import { PageTitleComponent } from '@sparrow-home/ui';
import { UserDataFacadeService } from '@sparrow-home/user-domain';

import { CreateUserFormComponent } from '../../component/create-user-form/create-user-form.component';

@Component({
  imports: [
    CommonModule,
    CreateUserFormComponent,
    TranslatePipe,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent,
    IonContent,
    IonHeader,
    IonToolbar,
    PageTitleComponent,
  ],
  templateUrl: './create-user-page.component.html',
})
export class CreateUserPageComponent {
  protected readonly dataService: UserDataFacadeService = inject(UserDataFacadeService);
  protected readonly appTitle: string = inject(APP_TITLE);
}
