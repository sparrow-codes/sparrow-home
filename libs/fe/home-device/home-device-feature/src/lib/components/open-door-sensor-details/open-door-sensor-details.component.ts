import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { OpenDoorSensor } from '@sparrow-home/home-device-domain';
import { BatteryStatusComponent } from '@sparrow-home/ui';

@Component({
  selector: 'sp-open-door-sensor-details',
  imports: [CommonModule, BatteryStatusComponent, MatDivider],
  templateUrl: './open-door-sensor-details.component.html',
})
export class OpenDoorSensorDetailsComponent {
  public readonly openDoorSensor: InputSignal<OpenDoorSensor> = input.required();
}
