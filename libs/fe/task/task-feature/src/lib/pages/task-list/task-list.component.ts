import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy,Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonProgressBar,
  IonSkeletonText,
  IonToolbar,
  ViewWillEnter,
} from '@ionic/angular';
import { bootstrapClockHistory } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AutomaticTask, TasksSignalStore, tasksSignalStore } from '@sparrow-home/task-domain';
import { OnboardingComponent, PageTitleComponent } from '@sparrow-home/ui';
import { Observable } from 'rxjs';

import { TaskCardComponent } from '../../components/task-card/task-card.component';

interface TaskStat {
  labelKey: string;
  icon: string;
  value: number;
}

@Component({
  selector: 'sp-task-list',
  imports: [
    CommonModule,
    PageTitleComponent,
    TaskCardComponent,
    RouterLink,
    TranslatePipe,
    NgIcon,
    OnboardingComponent,
    IonContent,
    IonHeader,
    IonButtons,
    IonToolbar,
    IonButton,
    IonCard,
    IonCardContent,
    IonIcon,
    IonInput,
    IonProgressBar,
    IonSkeletonText,
  ],
  templateUrl: './task-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [provideIcons({ bootstrapClockHistory })],
})
export class TaskListComponent implements ViewWillEnter {
  private readonly _store: TasksSignalStore = inject(tasksSignalStore);

  protected readonly tasks: Signal<AutomaticTask[]> = this._store.entities;
  protected readonly noSchedules: Signal<boolean | null> = this._store.noSchedules;
  protected readonly searchTerm: WritableSignal<string> = signal('');
  protected readonly filteredTasks: Signal<AutomaticTask[]> = computed(() => {
    const term: string = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.tasks();
    }

    return this.tasks().filter(
      (task) =>
        task.name.toLowerCase().includes(term) ||
        task.actions.some((action) => action.deviceName?.toLowerCase().includes(term))
    );
  });
  protected readonly stats: Signal<TaskStat[]> = computed(() => {
    const tasks: AutomaticTask[] = this.tasks();
    const active: number = tasks.filter((task) => task.isActive).length;

    return [
      { labelKey: 'tasks.stats_tasks', icon: 'list-outline', value: tasks.length },
      { labelKey: 'tasks.stats_active', icon: 'play-circle-outline', value: active },
      { labelKey: 'tasks.stats_paused', icon: 'pause-circle-outline', value: tasks.length - active },
    ];
  });
  protected readonly isLoading$: Observable<boolean> = this._store.isLoading$;
  protected readonly isRefreshing$: Observable<boolean> = this._store.isRefreshing$;
  protected readonly refreshingObjects: Signal<Set<number>> = this._store.refreshingObjects;

  public ionViewWillEnter(): void {
    this._store.fetchTasks();
  }

  protected activateTask(id: number, isActive: boolean): void {
    this._store.changeTaskStatus({ id, isActive });
  }
}
