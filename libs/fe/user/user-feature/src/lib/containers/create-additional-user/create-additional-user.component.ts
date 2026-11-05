import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { IonContent, IonHeader, IonToolbar } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { PageTitleComponent } from '@sparrow-home/ui';
import { UserDataFacadeService } from '@sparrow-home/user-domain';
import { Observable } from 'rxjs';

import { CreateUserFormComponent } from '../../component/create-user-form/create-user-form.component';

@Component({
  selector: 'sp-create-additional-user',
  imports: [
    CommonModule,
    CreateUserFormComponent,
    TranslatePipe,
    IonHeader,
    IonToolbar,
    IonContent,
    PageTitleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './create-additional-user.component.html',
})
export class CreateAdditionalUserComponent {
  protected readonly dataService: UserDataFacadeService = inject(UserDataFacadeService);
  protected readonly isLoading$: Observable<boolean> = this.dataService.isLoading$;
}
