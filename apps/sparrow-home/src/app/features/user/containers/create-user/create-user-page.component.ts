import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardComponent, sparrowFadeIn } from '@sparrow-codes/sparrow-ui';

import { DataFacadeService } from '~core/services/data-facade.service';
import { APP_TITLE } from '~core/tokens/app-title-token';
import { CreateUserFormComponent } from '~user/component/create-user-form/create-user-form.component';

@Component({
  standalone: true,
  imports: [CommonModule, CardComponent, CreateUserFormComponent],
  templateUrl: './create-user-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [sparrowFadeIn],
})
export class CreateUserPageComponent {
  protected readonly dataService: DataFacadeService = inject(DataFacadeService);
  protected readonly appTitle: string = inject(APP_TITLE);
}
