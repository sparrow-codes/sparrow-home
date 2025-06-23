import { CommonModule } from '@angular/common';
import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { bootstrapBattery, bootstrapBatteryFull, bootstrapBatteryHalf } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'sp-battery-status',
  imports: [CommonModule, NgIcon, Tag],
  providers: [provideIcons({ bootstrapBatteryFull, bootstrapBatteryHalf, bootstrapBattery })],
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
      return 'bootstrapBatteryFull';
    }

    if (batteryStatus <= 50 && batteryStatus > 20) {
      return 'bootstrapBatteryHalf';
    }

    return 'bootstrapBattery';
  });
}
