import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'sp-device-list-panel',
  imports: [CommonModule, RouterLink, TranslatePipe, Skeleton],
  templateUrl: './device-list-panel.component.html',
})
export class DeviceListPanelComponent {
  public readonly isLoading: InputSignal<boolean> = input<boolean>(false);
  public readonly haveInitialData: InputSignal<boolean> = input.required();
  public readonly nrOfDevices: InputSignal<number | null> = input.required();
}
