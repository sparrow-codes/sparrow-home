import { ChangeDetectionStrategy,Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton } from '@ionic/angular';
import { bootstrapAirplaneFill, bootstrapChevronRight } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'sp-vacation-mode-button',
  templateUrl: './vacation-mode-button.html',
  imports: [NgIconComponent, TranslatePipe, RouterLink, IonButton],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [provideIcons({ bootstrapAirplaneFill, bootstrapChevronRight })],
})
export class VacationModeButton {
  public readonly isVacationMode: InputSignal<boolean> = input.required();
}
