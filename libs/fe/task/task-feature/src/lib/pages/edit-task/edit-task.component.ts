import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal, OnInit, Signal } from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonSkeletonText,
  ModalController,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AutomaticTask, AvailableDevice, TasksSignalStore, tasksSignalStore } from '@sparrow-home/task-domain';
import { ConfirmationDialogComponent, Divider, PageTitleComponent } from '@sparrow-home/ui';
import { Observable } from 'rxjs';

import { ScheduleSettingsComponent } from '../../components/schedule-settings/schedule-settings.component';

@Component({
  selector: 'sp-edit-task',
  imports: [
    CommonModule,
    PageTitleComponent,
    ScheduleSettingsComponent,
    Divider,
    TranslatePipe,
    IonContent,
    IonHeader,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonToolbar,
    Divider,
    Divider,
    IonButton,
    IonSkeletonText,
  ],
  templateUrl: './edit-task.component.html',
})
export class EditTaskComponent implements OnInit {
  public readonly taskId: InputSignal<string> = input.required();

  private readonly _store: TasksSignalStore = inject(tasksSignalStore);
  private readonly _modalController: ModalController = inject(ModalController);
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

  protected async deleteTask(): Promise<void> {
    const modal: HTMLIonModalElement = await this._modalController.create({
      component: ConfirmationDialogComponent,
      componentProps: {
        content: this._translateService.instant('tasks.are_you_sure_delete_task', { taskName: this.task()?.name }),
      },
    });

    await modal.present();

    const { data }: { data?: boolean } = await modal.onDidDismiss();

    if (data) {
      this._store.deleteTask(Number(this.taskId()));
    }
  }
}
