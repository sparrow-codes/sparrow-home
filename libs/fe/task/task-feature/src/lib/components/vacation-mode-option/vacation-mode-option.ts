import { Component, model, ModelSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonToggle } from '@ionic/angular';
import { bootstrapAirplaneFill } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TaskAction } from '@sparrow-home/task-domain';

@Component({
  selector: 'sp-vacation-mode-option',
  imports: [NgIconComponent, FormsModule, TranslatePipe, IonToggle],
  templateUrl: './vacation-mode-option.html',
  providers: [provideIcons({ bootstrapAirplaneFill })],
})
export class VacationModeOption {
  public readonly taskAction: ModelSignal<TaskAction> = model.required();

  protected updateModel(runOnVacation: boolean): void {
    this.taskAction.update((action) => {
      action.runOnVacation = runOnVacation;
      return action;
    });
  }
}
