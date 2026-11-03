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
import {
  IonButton,
  IonLabel,
  IonRange,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  SegmentValue,
} from '@ionic/angular';
import { DeviceAction, humanize, HumanizePipe } from '@sparrow-home/utils';
import { debounceTime, Subject } from 'rxjs';

import { AbstractControlValueAccessor } from '../abstract-control-value-accessor';

@Component({
  selector: 'sp-device-action',
  imports: [
    FormsModule,
    HumanizePipe,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonRange,
  ],
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
  public readonly short: InputSignal<boolean> = input(false);

  protected readonly stateValue: Subject<unknown> = new Subject();
  protected readonly selectButtonOptions: Signal<{ key: string; value: SegmentValue }[]> = computed(() =>
    this.action().enumValues.map((value) => ({ key: humanize(value), value }))
  );
  protected readonly options: Signal<{ key: string; value: unknown }[]> = computed(() => {
    return this.action().enumValues.map((value) => ({ key: humanize(value), value: value }));
  });

  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.stateValue
      .pipe(debounceTime(500), takeUntilDestroyed(this._destroyRef))
      .subscribe((stateValue) => this.setValue(stateValue));
  }

  protected setValue(value: unknown): void {
    const payload: Record<string, unknown> = {
      [this.action().key]: value,
    };

    this.callAction.emit(payload);
    this.updateValue(payload);
  }

  protected readonly Number = Number;
}
