import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheckCircle, heroNoSymbol } from '@ng-icons/heroicons/outline';
import { HeatPump } from '@shared-models/panasonic-cloud-models';

@Component({
  selector: 'app-heat-pump',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './heat-pump.component.html',
  styleUrl: './heat-pump.component.css',
  providers: [provideIcons({ heroCheckCircle, heroNoSymbol })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeatPumpComponent {
  public readonly heatPump: InputSignal<HeatPump> = input.required();
}
