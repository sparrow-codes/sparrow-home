import { CommonModule } from '@angular/common';
import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroBattery0, heroBattery50, heroBattery100 } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'sp-battery-status',
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ heroBattery0, heroBattery50, heroBattery100 })],
  templateUrl: './battery-status.component.html',
})
export class BatteryStatusComponent {
  public readonly batteryStatus: InputSignal<number> = input<number>(0);

  protected readonly batteryIconName: Signal<string> = computed(() => {
    const batteryStatus: number | null = this.batteryStatus();

    if (batteryStatus === null) {
      return '';
    }

    if (batteryStatus > 50) {
      return 'heroBattery100';
    }

    if (batteryStatus <= 50 && batteryStatus > 20) {
      return 'heroBattery50';
    }

    return 'heroBattery0';
  });
}
