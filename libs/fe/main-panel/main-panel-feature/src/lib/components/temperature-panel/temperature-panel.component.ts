import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { bootstrapShieldFillCheck } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DeviceType } from '@sparrow-home/utils';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'sp-temperature-panel',
  imports: [CommonModule, RouterLink, TranslatePipe, Skeleton, NgIcon],
  templateUrl: './temperature-panel.component.html',
  providers: [provideIcons({ bootstrapShieldFillCheck })],
})
export class TemperaturePanelComponent {
  public readonly temperature: InputSignal<number | null> = input<number | null>(null);
  public readonly isHouseClosed: InputSignal<boolean | null> = input.required();
  public readonly isLoading: InputSignal<boolean> = input<boolean>(false);

  protected readonly deviceType: typeof DeviceType = DeviceType;
  protected readonly DeviceType = DeviceType;
}
