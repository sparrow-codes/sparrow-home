import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, InputSignal, OnInit, Signal } from '@angular/core';
import { AppStore, appStore } from '@sparrow-home/core';
import { AutomaticTask, AvailableDevice } from '@sparrow-home/task-domain';
import { ConfirmationDialogComponent, ConfirmationDialogData, PageTitleComponent } from '@sparrow-home/ui';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { DialogService } from 'primeng/dynamicdialog';
import { filter, take } from 'rxjs';

import { ScheduleSettingsComponent } from '../../components/schedule-settings/schedule-settings.component';

@Component({
  selector: 'sp-edit-task',
  imports: [CommonModule, PageTitleComponent, ScheduleSettingsComponent, Card, Divider, Button],
  templateUrl: './edit-task.component.html',
})
export class EditTaskComponent implements OnInit {
  public readonly taskId: InputSignal<string> = input.required();

  private readonly _store: AppStore = inject(appStore);
  private readonly _dialogService: DialogService = inject(DialogService);

  protected readonly task: Signal<AutomaticTask | undefined> = computed(() => this._store.entityMap()[this.taskId()]);
  protected readonly isLoading: Signal<boolean> = this._store.isLoading;
  protected readonly devices: Signal<AvailableDevice[]> = this._store.availableDevices;

  public ngOnInit(): void {
    this._store.getAvailableDevices();
  }

  protected onUpdateTask(task: Partial<AutomaticTask>): void {
    this._store.updateTask(task as AutomaticTask);
  }

  protected deleteTask(): void {
    this._dialogService
      .open(ConfirmationDialogComponent, {
        header: 'Usuń zadanie',
        modal: true,
        width: '90vw',
        data: {
          content: `Czy na pewno chcesz usunąć zadanie o nazwie: ${this.task()?.name}?`,
        } as ConfirmationDialogData,
      })
      ?.onClose.pipe(
        take(1),
        filter((result) => !!result)
      )
      .subscribe(() => this._store.deleteTask(Number(this.taskId())));
  }
}
