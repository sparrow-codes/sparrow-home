import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { bootstrapClockHistory } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AutomaticTask, TasksSignalStore, tasksSignalStore } from '@sparrow-home/task-domain';
import { OnboardingComponent, PageTitleComponent } from '@sparrow-home/ui';
import { Button } from 'primeng/button';

import { TaskCardComponent } from '../../components/task-card/task-card.component';

@Component({
  selector: 'sp-task-list',
  imports: [
    CommonModule,
    PageTitleComponent,
    TaskCardComponent,
    Button,
    RouterLink,
    TranslatePipe,
    NgIcon,
    OnboardingComponent,
  ],
  templateUrl: './task-list.component.html',
  providers: [provideIcons({ bootstrapClockHistory })],
})
export class TaskListComponent implements OnInit {
  private readonly _store: TasksSignalStore = inject(tasksSignalStore);

  protected readonly tasks: Signal<AutomaticTask[]> = this._store.entities;
  protected readonly noTasks: Signal<boolean> = computed(() => this.tasks().length === 0);

  public ngOnInit(): void {
    this._store.fetchTasks();
  }

  protected activateTask(id: number, isActive: boolean): void {
    this._store.changeTaskStatus({ id, isActive });
  }
}
