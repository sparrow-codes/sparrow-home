import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonSkeletonText, IonToolbar } from '@ionic/angular';
import { bootstrapClockHistory } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AutomaticTask, TasksSignalStore, tasksSignalStore } from '@sparrow-home/task-domain';
import { Divider, OnboardingComponent, PageTitleComponent } from '@sparrow-home/ui';
import { Observable } from 'rxjs';

import { TaskCardComponent } from '../../components/task-card/task-card.component';

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
    Divider,
    IonContent,
    IonHeader,
    IonButtons,
    IonToolbar,
    IonButton,
    IonIcon,
    Divider,
    IonSkeletonText,
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
  protected readonly refreshingObjects: Signal<Set<number>> = this._store.refreshingObjects;

  public ngOnInit(): void {
    this._store.fetchTasks();
  }

  protected activateTask(id: number, isActive: boolean): void {
    this._store.changeTaskStatus({ id, isActive });
  }
}
