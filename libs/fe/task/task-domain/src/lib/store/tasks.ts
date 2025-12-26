import { effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { HomeDeviceApiService, TasksApiService } from '@sparrow-home/api';
import { appStore } from '@sparrow-home/core';
import { toDeviceAction } from '@sparrow-home/utils';
import { MessageService } from 'primeng/api';
import { finalize, map, pipe, switchMap, tap } from 'rxjs';

import { AutomaticTask, AvailableDevice } from '../model';
import { toActionJobDto } from './functions/to-action-job-dto/to-action-job-dto';
import { toAutomaticTask } from './functions/to-automatic-task/to-automatic-task';

export type TasksSignalStore = InstanceType<typeof tasksSignalStore>;

export const tasksSignalStore = signalStore(
  withState<{ availableDevices: AvailableDevice[]; isLoading: boolean; noSchedules: boolean | null }>({
    availableDevices: [],
    isLoading: false,
    noSchedules: null,
  }),
  withEntities<AutomaticTask>(),
  withProps(
    (
      store,
      _taskApiService = inject(TasksApiService),
      _messageService = inject(MessageService),
      _homeDeviceApiService = inject(HomeDeviceApiService),
      _translate = inject(TranslateService)
    ) => ({
      _taskApiService,
      _homeDeviceApiService,
      _messageService,
      _translate,
      _fetchTasksList: _taskApiService.getTaskList().pipe(
        tapResponse({
          next: (tasks) => {
            patchState(store, setAllEntities(tasks.map((task) => toAutomaticTask(task))), {
              noSchedules: tasks.length === 0,
            });
          },
          error: () =>
            _messageService.add({ summary: _translate.instant('tasks.fetch_list_error'), severity: 'error' }),
        })
      ),
    })
  ),
  withMethods((store, router = inject(Router)) => ({
    fetchTasks: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => store._fetchTasksList.pipe(finalize(() => patchState(store, { isLoading: false }))))
      )
    ),
    changeTaskStatus: rxMethod<{
      id: number;
      isActive: boolean;
    }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((input) =>
          store._taskApiService
            .setTaskStatus({
              id: input.id,
              active: input.isActive,
            })
            .pipe(
              tapResponse({
                next: () =>
                  store._messageService.add({
                    summary: store._translate.instant('tasks.status_changed'),
                    severity: 'success',
                  }),
                error: () =>
                  store._messageService.add({
                    summary: store._translate.instant('tasks.activation_error'),
                    severity: 'error',
                  }),
              }),
              switchMap(() => store._fetchTasksList),
              finalize(() => patchState(store, { isLoading: false }))
            )
        )
      )
    ),
    deleteTask: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((taskId) =>
          store._taskApiService.deleteTask({ id: taskId }).pipe(
            tapResponse({
              next: () => {
                store._messageService.add({
                  summary: store._translate.instant('tasks.deleted'),
                  severity: 'success',
                });
                router.navigate(['automation']);
              },
              error: () =>
                store._messageService.add({
                  summary: store._translate.instant('tasks.delete_error'),
                  severity: 'error',
                }),
            }),
            switchMap(() => store._fetchTasksList),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    createTask: rxMethod<Partial<AutomaticTask>>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((newTask) =>
          store._taskApiService
            .createTask({
              body: {
                name: newTask.name ?? '',
                daysOfTheWeek: newTask.daysOfWeek,
                actions: newTask.actions?.map((action) => toActionJobDto(action)) ?? null,
              },
            })
            .pipe(
              tapResponse({
                next: () => {
                  store._messageService.add({
                    summary: store._translate.instant('tasks.created'),
                    severity: 'success',
                  });
                  router.navigate(['automation']);
                },
                error: () =>
                  store._messageService.add({
                    summary: store._translate.instant('tasks.creation_error'),
                    severity: 'error',
                  }),
              }),
              switchMap(() => store._fetchTasksList),
              finalize(() => patchState(store, { isLoading: false }))
            )
        )
      )
    ),
    updateTask: rxMethod<AutomaticTask>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((task) =>
          store._taskApiService
            .updateTask({
              body: {
                name: task.name,
                daysOfTheWeek: task.daysOfWeek,
                actions: task.actions.map((action) => toActionJobDto(action)),
              },
              id: task.id.toString(),
            })
            .pipe(
              tapResponse({
                next: () => {
                  store._messageService.add({
                    summary: store._translate.instant('tasks.update_success'),
                    severity: 'success',
                  });
                  router.navigate(['automation']);
                },
                error: () =>
                  store._messageService.add({
                    summary: store._translate.instant('tasks.update_error'),
                    severity: 'error',
                  }),
              }),
              switchMap(() => store._fetchTasksList),
              finalize(() => patchState(store, { isLoading: false }))
            )
        )
      )
    ),
    getAvailableDevices: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          store._homeDeviceApiService.getAllDevices({ body: {} }).pipe(
            map((devices) => devices.filter((device) => device.actions.length)),
            tapResponse({
              next: (response) =>
                patchState(store, {
                  availableDevices: response.map((device) => ({
                    id: device.homeDeviceId,
                    name: device.name,
                    description: device.description,
                    homeDeviceId: device.homeDeviceId,
                    actions: device.actions.map((action) => toDeviceAction(action)),
                  })),
                }),
              error: () =>
                store._messageService.add({
                  summary: store._translate.instant('tasks.fetch_devices_error'),
                  severity: 'error',
                }),
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
  })),
  withHooks((store, appSignalStore = inject(appStore)) => ({
    onInit: (): void => {
      effect(() => {
        if (store.isLoading()) {
          appSignalStore.withGlobalLoading();
        } else {
          appSignalStore.withNoGlobalLoading();
        }
      });
    },
  }))
);
