import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'sp-signal-strength',
  imports: [CommonModule],
  templateUrl: './signal-strength.component.html',
})
export class SignalStrengthComponent {
  public readonly signalStrength: InputSignal<number> = input.required();
}
