import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { AppStore, appStore } from '@sparrow-home/core';
import { AutomaticTask, AvailableDevice } from '@sparrow-home/task-domain';
import { PageTitleComponent } from '@sparrow-home/ui';

import { ScheduleSettingsComponent } from '../../components/schedule-settings/schedule-settings.component';

@Component({
  selector: 'sp-new-task',
  imports: [CommonModule, PageTitleComponent, ScheduleSettingsComponent],
  templateUrl: './new-task.component.html',
})
export class NewTaskComponent implements OnInit {
  private readonly _store: AppStore = inject(appStore);

  protected readonly isLoading: Signal<boolean> = this._store.isLoading;
  protected readonly devices: Signal<AvailableDevice[]> = this._store.availableDevices;

  public ngOnInit(): void {
    this._store.getAvailableDevices();
  }

  protected onCreateTask(task: Partial<AutomaticTask>): void {
    this._store.createTask(task);
  }
}
