import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { HeatPump } from '@shared-models/panasonic-cloud-models';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-heat-pump',
  standalone: true,
  imports: [CommonModule, NgIconComponent, TableModule, DividerModule],
  templateUrl: './heat-pump.component.html',
  styleUrl: './heat-pump.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeatPumpComponent {
  public readonly heatPump: InputSignal<HeatPump> = input.required();
}
