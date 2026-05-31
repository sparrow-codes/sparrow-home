
import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'sp-signal-strength',
  imports: [],
  templateUrl: './signal-strength.component.html',
})
export class SignalStrengthComponent {
  public readonly signalStrength: InputSignal<number> = input.required();
}
