import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DeviceType } from '@sparrow-home/utils';

@Component({
  selector: 'sp-temperature-panel',
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './temperature-panel.component.html',
})
export class TemperaturePanelComponent {
  public readonly temperature: InputSignal<number | null> = input<number | null>(null);
  public readonly isHouseClosed: InputSignal<boolean | null> = input.required();

  protected readonly deviceType: typeof DeviceType = DeviceType;
  protected readonly DeviceType = DeviceType;
}
