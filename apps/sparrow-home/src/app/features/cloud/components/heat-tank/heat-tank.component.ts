import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroNoSymbol } from '@ng-icons/heroicons/outline';
import { heroCheckCircleSolid } from '@ng-icons/heroicons/solid';

import { ZoneStatus } from '~api/cloud/models/get-heat-pump-details-response';

@Component({
  selector: 'app-heat-tank',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './heat-tank.component.html',
  providers: [provideIcons({ heroCheckCircleSolid, heroNoSymbol })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeatTankComponent {
  public readonly zone: InputSignal<ZoneStatus> = input.required();
}
