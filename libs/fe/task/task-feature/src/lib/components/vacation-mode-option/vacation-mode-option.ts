import { Component, model, ModelSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapAirplaneFill } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TaskAction } from '@sparrow-home/task-domain';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'sp-vacation-mode-option',
  imports: [NgIconComponent, ToggleSwitch, FormsModule, TranslatePipe],
  templateUrl: './vacation-mode-option.html',
  providers: [provideIcons({ bootstrapAirplaneFill })],
})
export class VacationModeOption {
  public readonly taskAction: ModelSignal<TaskAction> = model.required();

  protected updateModel(runOnVacation: boolean): void {
    const currentAction: TaskAction = this.taskAction();
    this.taskAction.set({
      ...currentAction,
      runOnVacation,
    });
  }
}
