import { CommonModule } from '@angular/common';
import { Component, model, ModelSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'sp-alarm-panel',
  imports: [CommonModule, FormsModule, Tag, ToggleSwitch],
  templateUrl: './alarm-panel.component.html',
})
export class AlarmPanelComponent {
  public readonly isAlarmOn: ModelSignal<boolean> = model.required();
}
