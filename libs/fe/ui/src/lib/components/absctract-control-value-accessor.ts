import { Directive, model, ModelSignal, Signal, signal, WritableSignal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive()
export abstract class AbstractControlValueAccessor<T> implements ControlValueAccessor {
  private readonly _value: WritableSignal<T | null> = signal<T | null>(null);

  public onChange?: (value: T) => void;
  public onTouch?: () => void;

  public readonly value: Signal<T | null> = this._value.asReadonly();
  public readonly disabled: ModelSignal<boolean> = model(false);

  public writeValue(value: T | null): void {
    this._value.set(value);
  }
  public registerOnChange(onChange: () => void): void {
    this.onChange = onChange;
  }
  public registerOnTouched(onTouch: () => void): void {
    this.onTouch = onTouch;
  }
  public setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
