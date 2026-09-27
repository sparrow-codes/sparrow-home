import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { bootstrapAirplaneFill, bootstrapChevronRight } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'sp-vacation-mode-button',
  templateUrl: './vacation-mode-button.html',
  imports: [NgIconComponent, ButtonDirective, TranslatePipe, RouterLink],
  providers: [provideIcons({ bootstrapAirplaneFill, bootstrapChevronRight })],
})
export class VacationModeButton {
  public readonly isVacationMode: InputSignal<boolean> = input.required();
}
