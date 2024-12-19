import { Component, input, InputSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroAdjustmentsHorizontal, heroNoSymbol } from '@ng-icons/heroicons/outline';
import { heroCheckCircleSolid } from '@ng-icons/heroicons/solid';

import { ZoneStatus } from '~api/cloud/models/get-heat-pump-details-response';

@Component({
  selector: 'app-heat-tank',
  imports: [NgIcon, ReactiveFormsModule],
  templateUrl: './heat-tank.component.html',
  providers: [provideIcons({ heroCheckCircleSolid, heroNoSymbol, heroAdjustmentsHorizontal })],
})
export class HeatTankComponent {
  public readonly zone: InputSignal<ZoneStatus> = input.required();
}
