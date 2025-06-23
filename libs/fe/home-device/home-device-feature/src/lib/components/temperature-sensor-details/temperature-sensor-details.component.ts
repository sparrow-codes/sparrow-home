import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { TemperatureSensor } from '@sparrow-home/home-device-domain';
import { BatteryStatusComponent } from '@sparrow-home/ui';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'sp-temperature-sensor-details',
  imports: [CommonModule, BatteryStatusComponent, Divider],
  templateUrl: './temperature-sensor-details.component.html',
})
export class TemperatureSensorDetailsComponent {
  public readonly temperatureSensor: InputSignal<TemperatureSensor> = input.required();
}
