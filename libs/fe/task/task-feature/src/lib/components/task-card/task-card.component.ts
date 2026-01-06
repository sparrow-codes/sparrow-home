import { CommonModule } from '@angular/common';
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
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AutomaticTask } from '@sparrow-home/task-domain';
import { AnimatedCheckCircleComponent } from '@sparrow-home/ui';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'sp-task-card',
  imports: [
    CommonModule,
    Card,
    RouterLink,
    ToggleSwitch,
    FormsModule,
    TranslatePipe,
    Tag,
    AnimatedCheckCircleComponent,
  ],
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
