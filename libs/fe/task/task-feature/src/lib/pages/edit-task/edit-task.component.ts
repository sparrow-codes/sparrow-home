import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, InputSignal, OnInit, Signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AutomaticTask, AvailableDevice, TasksSignalStore, tasksSignalStore } from '@sparrow-home/task-domain';
import { ConfirmationDialogComponent, ConfirmationDialogData, PageTitleComponent } from '@sparrow-home/ui';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { DialogService } from 'primeng/dynamicdialog';
import { filter, take } from 'rxjs';

import { ScheduleSettingsComponent } from '../../components/schedule-settings/schedule-settings.component';

@Component({
  selector: 'sp-edit-task',
  imports: [CommonModule, PageTitleComponent, ScheduleSettingsComponent, Divider, Button, TranslatePipe],
  templateUrl: './edit-task.component.html',
})
export class EditTaskComponent implements OnInit {
  public readonly taskId: InputSignal<string> = input.required();

  private readonly _store: TasksSignalStore = inject(tasksSignalStore);
  private readonly _dialogService: DialogService = inject(DialogService);
  private readonly _translateService: TranslateService = inject(TranslateService);

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
        header: this._translateService.instant('tasks.delete_task'),
        modal: true,
        width: '90vw',
        data: {
          content: this._translateService.instant('tasks.are_you_sure_delete_task', { taskName: this.task()?.name }),
        } as ConfirmationDialogData,
      })
      ?.onClose.pipe(
        take(1),
        filter((result) => !!result)
      )
      .subscribe(() => this._store.deleteTask(Number(this.taskId())));
  }
}
