import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';

import { Configuration } from '~core/models/configuration';
import { DataFacadeService } from '~core/services/data-facade.service';
import { PageTitleComponent } from '~ui/components/page-title/page-title.component';

import { ConfigurationFormComponent } from '../../components/configuration-form/configuration-form.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    ReactiveFormsModule,
    ConfigurationFormComponent,
    MatCard,
    MatFormField,
    MatSelect,
    MatOption,
    MatFormFieldModule,
    MatCardModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
  protected readonly dataFacadeService: DataFacadeService = inject(DataFacadeService);
  protected readonly modeControl: FormControl = new FormControl(this.dataFacadeService.configuration()?.mode);
  protected readonly modeOptions: Signal<{ value: number; label: string }[]> = computed(() =>
    this.dataFacadeService.modeDictionary()
  );

  protected readonly configuration: Signal<Configuration | null> = this.dataFacadeService.configuration;

  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.modeControl.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value) => {
      this.dataFacadeService.setMode(value);
    });
  }

  protected saveConfiguration(configuration: Configuration): void {
    this.dataFacadeService.saveConfiguration(configuration);
  }
}
