import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AutomaticTask, TasksSignalStore, tasksSignalStore } from '@sparrow-home/task-domain';
import { PageTitleComponent, spFadeInAnimation } from '@sparrow-home/ui';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';

import { TaskCardComponent } from '../../components/task-card/task-card.component';

@Component({
  selector: 'sp-task-list',
  imports: [CommonModule, PageTitleComponent, TaskCardComponent, Button, RouterLink, Divider, TranslatePipe],
  templateUrl: './task-list.component.html',
  animations: [spFadeInAnimation],
})
export class TaskListComponent implements OnInit {
  private readonly _store: TasksSignalStore = inject(tasksSignalStore);

  protected readonly tasks: Signal<AutomaticTask[]> = this._store.entities;

  public ngOnInit(): void {
    this._store.fetchTasks();
  }

  protected activateTask(id: number, isActive: boolean): void {
    this._store.changeTaskStatus({ id, isActive });
  }
}
