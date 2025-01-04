import { Component, input, InputSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroAdjustmentsHorizontal, heroNoSymbol } from '@ng-icons/heroicons/outline';
import { heroCheckCircleSolid } from '@ng-icons/heroicons/solid';
import { HeatTank } from '@sparrow-home/heat-pump-domain';

@Component({
  selector: 'sp-heat-tank',
  imports: [NgIcon, ReactiveFormsModule],
  templateUrl: './heat-tank.component.html',
  providers: [provideIcons({ heroCheckCircleSolid, heroNoSymbol, heroAdjustmentsHorizontal })],
})
export class HeatTankComponent {
  public readonly heatTank: InputSignal<HeatTank> = input.required();
}
