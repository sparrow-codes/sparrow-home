import { ChangeDetectionStrategy,Component, model, ModelSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonBadge, IonItem, IonToggle } from '@ionic/angular';
import { bootstrapBell } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'sp-alarm-panel',
  imports: [FormsModule, TranslatePipe, IonItem, IonBadge, NgIcon, IonToggle],
  providers: [provideIcons({ bootstrapBell })],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './alarm-panel.component.html',
})
export class AlarmPanelComponent {
  public readonly isAlarmOn: ModelSignal<boolean> = model.required();
}
