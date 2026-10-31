import {
  Component,
  computed,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonBadge, IonChip, IonIcon, IonItem, IonToggle } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { AutomaticTask } from '@sparrow-home/task-domain';
import { AnimatedCheckCircleComponent } from '@sparrow-home/ui';

@Component({
  selector: 'sp-task-card',
  imports: [RouterLink, TranslatePipe, AnimatedCheckCircleComponent, IonItem, IonToggle, IonChip, IonIcon, IonBadge],
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  public readonly task: ModelSignal<AutomaticTask> = model.required();
  public readonly isActive: OutputEmitterRef<boolean> = output();
  public readonly refreshingObjects: InputSignal<Set<number>> = input.required();

  protected readonly showFinishAnimation: Signal<boolean> = computed(() => {
    return this.refreshingObjects().has(this.task().id);
  });

  protected changeTaskStatus(isActive: boolean): void {
    this.task.update((task) => ({ ...task, isActive }));
    this.isActive.emit(isActive);
  }
}
