import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { AppStore, appStore } from '@sparrow-home/core';
import { AutomaticTask, AvailableDevice } from '@sparrow-home/task-domain';
import { PageTitleComponent } from '@sparrow-home/ui';

import { ScheduleSettingsComponent } from '../../components/schedule-settings/schedule-settings.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'sp-new-task',
  imports: [CommonModule, PageTitleComponent, ScheduleSettingsComponent, Card],
  templateUrl: './new-task.component.html',
})
export class NewTaskComponent implements OnInit {
  private readonly _store: AppStore = inject(appStore);

  protected readonly options: Signal<AvailableDevice[]> = this._store.availableDevices;

  public ngOnInit(): void {
    this._store.getAvailableDevices();
  }

  protected onCreateTask(task: Partial<AutomaticTask>): void {
    this._store.createTask(task);
  }
}
