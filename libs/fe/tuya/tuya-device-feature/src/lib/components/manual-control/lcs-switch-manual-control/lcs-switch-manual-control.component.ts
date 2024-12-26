import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, InputSignal, OnInit, output, OutputEmitterRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { LcsSwitch } from '@sparrow-home/tuya-device-domain';

@Component({
  selector: 'sp-lcs-switch-manual-control',
  imports: [CommonModule, MatSlideToggle, ReactiveFormsModule],
  templateUrl: './lcs-switch-manual-control.component.html',
})
export class LcsSwitchManualControlComponent implements OnInit {
  public readonly switchChange: OutputEmitterRef<boolean> = output();
  public readonly lcsSwitch: InputSignal<LcsSwitch> = input.required();

  protected switch?: FormControl<boolean>;

  private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.switch = this._fb.control(this.lcsSwitch().isOn);
    this.switch.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => this.switchChange.emit(value));
  }
}
