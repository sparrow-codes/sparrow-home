import { ChangeDetectionStrategy,Component, input, InputSignal } from '@angular/core';
import { IonIcon } from '@ionic/angular';

@Component({
  selector: 'sp-signal-strength',
  imports: [IonIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './signal-strength.component.html',
})
export class SignalStrengthComponent {
  public readonly signalStrength: InputSignal<number> = input.required();
}
