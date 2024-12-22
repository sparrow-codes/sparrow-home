import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Configuration, DataFacadeService } from '@sparrow-home/core';
import { PageTitleComponent } from '@sparrow-home/ui';

import { ConfigurationFormComponent } from '../../components/configuration-form/configuration-form.component';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConfigurationFormComponent,
    MatFormFieldModule,
    MatCardModule,
    PageTitleComponent,
  ],
  templateUrl: './main.component.html',
})
export class MainComponent {
  protected readonly dataFacadeService: DataFacadeService = inject(DataFacadeService);
  protected readonly configuration: Signal<Configuration | null> = this.dataFacadeService.configuration;

  protected saveConfiguration(configuration: Configuration): void {
    this.dataFacadeService.saveConfiguration(configuration);
  }
}
