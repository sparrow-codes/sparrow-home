import { CommonModule } from '@angular/common';
import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { HumanizePipe } from '@sparrow-home/utils';

@Component({
  selector: 'sp-device-param',
  imports: [CommonModule, HumanizePipe],
  templateUrl: './device-param.component.html',
})
export class DeviceParamComponent {
  public readonly deviceParam: InputSignal<[string, string]> = input.required();
  protected readonly key: Signal<string> = computed(() => this.deviceParam()[0]);
  protected readonly value: Signal<string> = computed(() => this.deviceParam()[1]);
}
