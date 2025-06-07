import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sp-temperature-panel',
  imports: [CommonModule, RouterLink],
  templateUrl: './temperature-panel.component.html',
})
export class TemperaturePanelComponent {
  public readonly temperature: InputSignal<number | null> = input<number | null>(null);
  public readonly isHouseClosed: InputSignal<boolean | null> = input.required();
}
