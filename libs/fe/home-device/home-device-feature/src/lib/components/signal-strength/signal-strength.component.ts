import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'sp-signal-strength',
  imports: [CommonModule, NgIcon],
  templateUrl: './signal-strength.component.html',
})
export class SignalStrengthComponent {
  public readonly signalStrength: InputSignal<number> = input.required();
}
