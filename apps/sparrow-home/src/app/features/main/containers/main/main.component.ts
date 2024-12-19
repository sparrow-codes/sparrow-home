import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Configuration } from '../../../../core/models/configuration';
import { DataFacadeService } from '../../../../core/services/data-facade.service';
import { PageTitleComponent } from '../../../../ui/components/page-title/page-title.component';
import { ConfigurationFormComponent } from '../../components/configuration-form/configuration-form.component';

@Component({
  imports: [
    CommonModule,
    PageTitleComponent,
    ReactiveFormsModule,
    ConfigurationFormComponent,
    MatFormFieldModule,
    MatCardModule,
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
