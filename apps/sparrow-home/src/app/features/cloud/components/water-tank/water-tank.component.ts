import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroNoSymbol } from '@ng-icons/heroicons/outline';
import { heroCheckCircleSolid } from '@ng-icons/heroicons/solid';

import { TankStatus } from '~api/cloud/models/get-heat-pump-details-response';

@Component({
  selector: 'app-water-tank',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './water-tank.component.html',
  providers: [provideIcons({ heroCheckCircleSolid, heroNoSymbol })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaterTankComponent {
  public readonly waterTank: InputSignal<TankStatus> = input.required();
}
