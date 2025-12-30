import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { bootstrapClockHistory } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AutomaticTask, TasksSignalStore, tasksSignalStore } from '@sparrow-home/task-domain';
import { OnboardingComponent, PageTitleComponent } from '@sparrow-home/ui';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Skeleton } from 'primeng/skeleton';
import { Observable } from 'rxjs';

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
    Skeleton,
    Divider,
  ],
  templateUrl: './task-list.component.html',
  providers: [provideIcons({ bootstrapClockHistory })],
})
export class TaskListComponent implements OnInit {
  private readonly _store: TasksSignalStore = inject(tasksSignalStore);

  protected readonly tasks: Signal<AutomaticTask[]> = this._store.entities;
  protected readonly noSchedules: Signal<boolean | null> = this._store.noSchedules;
  protected readonly isLoading$: Observable<boolean> = this._store.isLoading$;
  protected readonly isRefreshing$: Observable<boolean> = this._store.isRefreshing$;

  public ngOnInit(): void {
    this._store.fetchTasks();
  }

  protected activateTask(id: number, isActive: boolean): void {
    this._store.changeTaskStatus({ id, isActive });
  }
}
