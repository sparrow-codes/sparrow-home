import { CommonModule } from '@angular/common';
import { Component, input, InputSignal, model, ModelSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'sp-alarm-panel',
  imports: [CommonModule, FormsModule, Tag, ToggleSwitch, Card, TranslatePipe],
  templateUrl: './alarm-panel.component.html',
})
export class AlarmPanelComponent {
  public readonly isAlarmOn: ModelSignal<boolean> = model.required();
  public readonly isAlarmAvailable: InputSignal<boolean> = input.required();
}
