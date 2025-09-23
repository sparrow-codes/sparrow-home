import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, type, withMethods, withProps, withState } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { HomeDeviceApiService, TasksApiService } from '@sparrow-home/api';
import { DeviceType } from '@sparrow-home/utils';
import { MessageService } from 'primeng/api';
import { finalize, map, pipe, switchMap, tap } from 'rxjs';

import { AutomaticTask, AvailableDevice } from '../model';
import { toTaskEntity } from './functions/to-task-entity';

export function withTasks() {
  return signalStoreFeature(
    {
      state: type<{ isLoading: boolean }>(),
    },
    withState<{ availableDevices: AvailableDevice[] }>({
      availableDevices: [],
    }),
    withEntities<AutomaticTask>(),
    withProps(
      (
        store,
        _taskApiService = inject(TasksApiService),
        _messageService = inject(MessageService),
        _homeDeviceApiService = inject(HomeDeviceApiService)
      ) => ({
        _taskApiService,
        _homeDeviceApiService,
        _messageService,
        _fetchTasksList: _taskApiService.getTaskList().pipe(
          tapResponse({
            next: (tasks) => {
              patchState(store, setAllEntities(tasks.map((task) => toTaskEntity(task))));
            },
            error: () => _messageService.add({ summary: 'Błąd pobierania listy zadań!', severity: 'error' }),
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
                    store._messageService.add({ summary: 'Status zadania został zmieniony', severity: 'success' }),
                  error: () => store._messageService.add({ summary: 'Błąd aktywacji zadania!', severity: 'error' }),
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
                  store._messageService.add({ summary: 'Zadanie usunięte.', severity: 'success' });
                  router.navigate(['automation']);
                },
                error: () =>
                  store._messageService.add({ summary: 'Błąd podczas usuwania zadania!', severity: 'error' }),
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
                  from: newTask.startTime?.toString(),
                  name: newTask.name ?? '',
                  to: newTask.endTime?.toString(),
                  assignedDevices: newTask.homeDevices ?? [],
                },
              })
              .pipe(
                tapResponse({
                  next: () => {
                    store._messageService.add({ summary: 'Utworzono zadanie', severity: 'success' });
                    router.navigate(['automation']);
                  },
                  error: () => store._messageService.add({ summary: 'Błąd tworzenia zadania', severity: 'error' }),
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
                  from: task.startTime?.toString(),
                  assignedDevices: task.homeDevices,
                  name: task.name,
                  to: task.endTime?.toString(),
                },
                id: task.id.toString(),
              })
              .pipe(
                tapResponse({
                  next: () => {
                    store._messageService.add({ summary: 'Modyfikacja zakończona pomyślnie', severity: 'success' });
                    router.navigate(['automation']);
                  },
                  error: () => store._messageService.add({ summary: 'Błąd modyfikacji zadania', severity: 'error' }),
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
              map((devices) =>
                devices.filter(
                  (device) => device.type === DeviceType.POWER_PLUG || device.type === DeviceType.PET_FEEDER
                )
              ),
              tapResponse({
                next: (response) =>
                  patchState(store, {
                    availableDevices: response.map((device) => ({ id: device.id, name: device.name })),
                  }),
                error: () =>
                  store._messageService.add({ summary: 'Błąd pobierania listy urządeń!', severity: 'error' }),
              }),
              finalize(() => patchState(store, { isLoading: false }))
            )
          )
        )
      ),
    }))
  );
}
