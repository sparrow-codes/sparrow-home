import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, CardComponent, SelectComponent } from '@sparrow-codes/sparrow-ui';
import { SelectOption } from '@sparrow-codes/sparrow-ui/lib/components/form-controls/select/model/select-option';

import { DataFacadeService } from '~core/services/data-facade.service';

import { PageTitleComponent } from '../../../../ui/components/page-title/page-title.component';

@Component({
  standalone: true,
  imports: [CommonModule, PageTitleComponent, ButtonComponent, CardComponent, SelectComponent, ReactiveFormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
  protected readonly dataFacadeService: DataFacadeService = inject(DataFacadeService);
  protected readonly modeControl: FormControl = new FormControl(this.dataFacadeService.currentMode());
  protected readonly modeOptions: Signal<SelectOption<number>[]> = computed(() =>
    this.dataFacadeService.modeDictionary()
  );

  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.modeControl.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value) => {
      this.dataFacadeService.setMode(value);
    });
  }
}
