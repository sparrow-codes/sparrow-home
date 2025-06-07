import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'sp-temperature-panel',
  imports: [CommonModule],
  templateUrl: './temperature-panel.component.html',
})
export class TemperaturePanelComponent {
  public readonly temperature: InputSignal<number | null> = input<number | null>(null);
}
