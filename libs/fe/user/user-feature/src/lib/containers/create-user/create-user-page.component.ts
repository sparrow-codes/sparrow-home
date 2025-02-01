import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { DataFacadeService } from '@sparrow-home/core';
import { APP_TITLE } from '@sparrow-home/core';

import { CreateUserFormComponent } from '../../component/create-user-form/create-user-form.component';

@Component({
  imports: [CommonModule, CreateUserFormComponent, MatCard, MatCardTitle, MatCardContent, MatCardHeader],
  templateUrl: './create-user-page.component.html',
})
export class CreateUserPageComponent {
  protected readonly dataService: DataFacadeService = inject(DataFacadeService);
  protected readonly appTitle: string = inject(APP_TITLE);
}
