import { Component, DestroyRef, effect, forwardRef, inject, Injector, input, InputSignal, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IonCheckbox, IonIcon, IonRadio, IonRadioGroup } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';

import { AbstractControlValueAccessor } from '../abstract-control-value-accessor';
import { Divider } from '../divider/divider';

@Component({
  selector: 'sp-days-of-week-control',
  imports: [IonCheckbox, IonIcon, IonRadio, IonRadioGroup, ReactiveFormsModule, TranslatePipe, Divider],
  templateUrl: './days-of-week-control.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DaysOfWeekControl),
      multi: true,
    },
  ],
})
export class DaysOfWeekControl extends AbstractControlValueAccessor<number[] | null> implements OnInit {
  public readonly notDefinedLabel: InputSignal<string> = input.required();

  protected readonly areAllDays: FormControl<boolean | null> = new FormControl<boolean | null>(true, {
    nonNullable: false,
  });
  protected readonly daysOfWeek: FormControl<number[]> = new FormControl<number[]>([] as number[], {
    nonNullable: true,
  });

  private readonly _injector: Injector = inject(Injector);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    effect(
      () => {
        const current: number[] | null = this.value();
        const isAll: boolean = this.value() === null;
        this.areAllDays.patchValue(isAll, { emitEvent: false });

        if (!isAll) {
          this.daysOfWeek.patchValue((current as number[]) ?? [], { emitEvent: false });
        }
      },
      { injector: this._injector }
    );

    this.areAllDays.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value: boolean | null) => {
      if (value) {
        this.updateValue(null);
        this.daysOfWeek.disable({ emitEvent: false });
      } else {
        this.daysOfWeek.enable({ emitEvent: false });
        this.updateValue(this.daysOfWeek.value ?? []);
      }
    });

    this.daysOfWeek.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value: number[]) => {
      if (!this.areAllDays.value) {
        this.updateValue(value);
      }
    });
  }

  protected isDaySelected(day: number): boolean {
    return this.daysOfWeek.value.includes(day);
  }

  protected setDaySelected(day: number, checked: boolean): void {
    const current: number[] = this.daysOfWeek.value;
    const next: number[] = checked
      ? current.includes(day)
        ? current
        : [...current, day]
      : current.filter((selectedDay: number) => selectedDay !== day);

    this.daysOfWeek.patchValue(next);
    this.onTouch?.();
  }
}
