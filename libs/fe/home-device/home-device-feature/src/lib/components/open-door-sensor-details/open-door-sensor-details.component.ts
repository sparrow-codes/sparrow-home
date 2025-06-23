import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { OpenDoorSensor } from '@sparrow-home/home-device-domain';
import { BatteryStatusComponent } from '@sparrow-home/ui';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'sp-open-door-sensor-details',
  imports: [CommonModule, BatteryStatusComponent, Divider],
  templateUrl: './open-door-sensor-details.component.html',
})
export class OpenDoorSensorDetailsComponent {
  public readonly openDoorSensor: InputSignal<OpenDoorSensor> = input.required();
}
