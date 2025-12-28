import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AutomaticTask, AvailableDevice, TasksSignalStore, tasksSignalStore } from '@sparrow-home/task-domain';
import { PageTitleComponent } from '@sparrow-home/ui';
import { Observable } from 'rxjs';

import { ScheduleSettingsComponent } from '../../components/schedule-settings/schedule-settings.component';

@Component({
  selector: 'sp-new-task',
  imports: [CommonModule, PageTitleComponent, ScheduleSettingsComponent, TranslatePipe],
  templateUrl: './new-task.component.html',
})
export class NewTaskComponent implements OnInit {
  private readonly _store: TasksSignalStore = inject(tasksSignalStore);

  protected readonly devices: Signal<AvailableDevice[]> = this._store.availableDevices;
  protected readonly isRefreshing$: Observable<boolean> = this._store.isRefreshing$;

  public ngOnInit(): void {
    this._store.getAvailableDevices();
  }

  protected onCreateTask(task: Partial<AutomaticTask>): void {
    this._store.createTask(task);
  }
}
