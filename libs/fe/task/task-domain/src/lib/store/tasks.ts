import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { removeAllEntities, removeEntity, setAllEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { HomeDeviceApiService, TasksApiService } from '@sparrow-home/api';
import {
  toDeviceAction,
  withFetching,
  withLoading,
  withoutLoading,
  withoutRefreshing,
  withRefreshing,
  withRefreshingObjects,
} from '@sparrow-home/utils';
import { MessageService } from 'primeng/api';
import { finalize, map, pipe, switchMap, tap } from 'rxjs';

import { AutomaticTask } from '../model';
import { TaskSignalStoreState } from '../model/task-signal-store-state';
import { toActionJobDto } from './functions/to-action-job-dto/to-action-job-dto';
import { toAutomaticTask } from './functions/to-automatic-task/to-automatic-task';

export type TasksSignalStore = InstanceType<typeof tasksSignalStore>;

export const tasksSignalStore = signalStore(
  withState<TaskSignalStoreState>({
    availableDevices: [],
    noSchedules: null,
    taskDetails: null,
  }),
  withFetching(),
  withEntities<AutomaticTask>(),
  withRefreshingObjects<number>(),
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
        tap(() =>
          patchState(store, { _isRefreshing: store.entities().length !== 0, _isLoading: store.entities().length === 0 })
        ),
        switchMap(() =>
          store._fetchTasksList.pipe(finalize(() => patchState(store, { _isLoading: false, _isRefreshing: false })))
        )
      )
    ),
    changeTaskStatus: rxMethod<{
      id: number;
      isActive: boolean;
    }>(
      pipe(
        tap(() => patchState(store, { _isRefreshing: true })),
        switchMap((input) =>
          store._taskApiService
            .setTaskStatus({
              id: input.id,
              active: input.isActive,
            })
            .pipe(
              tapResponse({
                next: () => store._refreshObject(input.id),
                error: () =>
                  store._messageService.add({
                    summary: store._translate.instant('tasks.activation_error'),
                    severity: 'error',
                  }),
              }),
              switchMap(() => store._fetchTasksList),
              finalize(() => patchState(store, { _isRefreshing: false }))
            )
        )
      )
    ),
    deleteTask: rxMethod<number>(
      pipe(
        tap(() => patchState(store, withRefreshing())),
        switchMap((taskId) =>
          store._taskApiService.deleteTask({ id: taskId }).pipe(
            tapResponse({
              next: () => {
                store._messageService.add({
                  summary: store._translate.instant('tasks.deleted'),
                  severity: 'contrast',
                });
                patchState(store, removeEntity(taskId));
                router.navigate(['automation']);
              },
              error: () => {
                store._messageService.add({
                  summary: store._translate.instant('tasks.delete_error'),
                  severity: 'error',
                });

                patchState(store, withoutRefreshing());
              },
            })
          )
        )
      )
    ),
    createTask: rxMethod<Partial<AutomaticTask>>(
      pipe(
        tap(() => patchState(store, withRefreshing())),
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
                    severity: 'contrast',
                  });
                  patchState(store, removeAllEntities());
                  router.navigate(['automation']);
                },
                error: () => {
                  store._messageService.add({
                    summary: store._translate.instant('tasks.creation_error'),
                    severity: 'error',
                  });

                  patchState(store, withoutRefreshing());
                },
              })
            )
        )
      )
    ),
    updateTask: rxMethod<AutomaticTask>(
      pipe(
        tap(() => patchState(store, withRefreshing())),
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
                    severity: 'contrast',
                  });
                  patchState(store, updateEntity({ id: task.id, changes: task }));
                  router.navigate(['automation']);
                },
                error: () => {
                  store._messageService.add({
                    summary: store._translate.instant('tasks.update_error'),
                    severity: 'error',
                  });

                  patchState(store, withoutRefreshing());
                },
              })
            )
        )
      )
    ),
    getTaskDetails: rxMethod<string>(
      pipe(
        tap(() => patchState(store, withLoading(), { taskDetails: null })),
        switchMap((id) =>
          store._taskApiService.getTaskDetails({ id: Number(id) }).pipe(
            tapResponse({
              next: (task) => patchState(store, { taskDetails: toAutomaticTask(task) }),
              error: () =>
                store._messageService.add({
                  summary: store._translate.instant('tasks.fetch_details_error'),
                  severity: 'error',
                }),
            }),
            finalize(() => patchState(store, withoutLoading()))
          )
        )
      )
    ),
    getAvailableDevices: rxMethod<void>(
      pipe(
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
            })
          )
        )
      )
    ),
  }))
);
