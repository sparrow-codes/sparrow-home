import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal, OnInit, Signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AutomaticTask, AvailableDevice, TasksSignalStore, tasksSignalStore } from '@sparrow-home/task-domain';
import { ConfirmationDialogComponent, ConfirmationDialogData, PageTitleComponent } from '@sparrow-home/ui';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { DialogService } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';
import { filter, Observable, take } from 'rxjs';

import { ScheduleSettingsComponent } from '../../components/schedule-settings/schedule-settings.component';

@Component({
  selector: 'sp-edit-task',
  imports: [CommonModule, PageTitleComponent, ScheduleSettingsComponent, Divider, Button, TranslatePipe, Skeleton],
  templateUrl: './edit-task.component.html',
})
export class EditTaskComponent implements OnInit {
  public readonly taskId: InputSignal<string> = input.required();

  private readonly _store: TasksSignalStore = inject(tasksSignalStore);
  private readonly _dialogService: DialogService = inject(DialogService);
  private readonly _translateService: TranslateService = inject(TranslateService);

  protected readonly task: Signal<AutomaticTask | null> = this._store.taskDetails;
  protected readonly devices: Signal<AvailableDevice[]> = this._store.availableDevices;
  protected readonly isRefreshing$: Observable<boolean> = this._store.isRefreshing$;
  protected readonly isLoading$: Observable<boolean> = this._store.isLoading$;

  public ngOnInit(): void {
    this._store.getAvailableDevices();
    this._store.getTaskDetails(this.taskId());
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
