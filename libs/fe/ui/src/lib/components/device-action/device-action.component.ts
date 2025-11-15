import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  forwardRef,
  inject,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DeviceAction, humanize, HumanizePipe } from '@sparrow-home/utils';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { Slider } from 'primeng/slider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { debounceTime, Subject } from 'rxjs';

import { AbstractControlValueAccessor } from '../absctract-control-value-accessor';

@Component({
  selector: 'sp-device-action',
  imports: [CommonModule, ToggleButtonModule, Select, FloatLabel, Slider, FormsModule, Button, HumanizePipe],
  templateUrl: './device-action.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DeviceActionComponent),
      multi: true,
    },
  ],
})
export class DeviceActionComponent extends AbstractControlValueAccessor<Record<string, unknown>> implements OnInit {
  public readonly action: InputSignal<DeviceAction> = input.required();
  public readonly callAction: OutputEmitterRef<Record<string, unknown>> = output();

  protected readonly stateValue: Subject<unknown> = new Subject();
  protected readonly options: Signal<{ key: string; value: unknown }[]> = computed(() => {
    return this.action()
      .enumValues.filter((value) => !!value)
      .map((value) => ({ key: humanize(value), value: value }));
  });

  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.stateValue
      .pipe(debounceTime(500), takeUntilDestroyed(this._destroyRef))
      .subscribe((stateValue) => this.updateValue(stateValue));
  }

  protected updateValue(value: unknown): void {
    const payload: Record<string, unknown> = {
      [this.action().key]: value,
    };

    this.callAction.emit(payload);
    this.writeValue(payload);

    if (this.onChange) {
      this.onChange(payload);
    }
  }

  protected readonly Number = Number;
}
