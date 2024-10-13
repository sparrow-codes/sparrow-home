import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, CardComponent, SelectComponent } from '@sparrow-codes/sparrow-ui';
import { SelectOption } from '@sparrow-codes/sparrow-ui/lib/components/form-controls/select/model/select-option';

import { Configuration } from '~core/models/configuration';
import { DataFacadeService } from '~core/services/data-facade.service';
import { LoaderComponent } from '~ui/components/loader/loader.component';
import { PageSubtitleComponent } from '~ui/components/page-subtitle/page-subtitle.component';
import { PageTitleComponent } from '~ui/components/page-title/page-title.component';

import { ConfigurationFormComponent } from '../../components/configuration-form/configuration-form.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    ButtonComponent,
    CardComponent,
    SelectComponent,
    ReactiveFormsModule,
    ConfigurationFormComponent,
    PageSubtitleComponent,
    LoaderComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
  protected readonly dataFacadeService: DataFacadeService = inject(DataFacadeService);
  protected readonly modeControl: FormControl = new FormControl(this.dataFacadeService.configuration()?.mode);
  protected readonly modeOptions: Signal<SelectOption<number>[]> = computed(() =>
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
