import { TestBed } from '@angular/core/testing';
import { signalStore, withState } from '@ngrx/signals';
import { HomeDeviceApiService, HomeDeviceDetailsDtoApiModel, TasksApiService } from '@sparrow-home/api';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { AutomaticTask } from '../model/automatic-task';
import { withTasks } from './tasks';

const mockMessageService = {
  add: jest.fn(),
};

const mockTaskApiService = {
  getTaskList: jest.fn(() => of([] as AutomaticTask[])),
  setTaskStatus: jest.fn(),
  deleteTask: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
};

const mockHomeDeviceApiService = {
  getAllDevices: jest.fn(),
};

describe('withTasks signal store', () => {
  const rootStore = signalStore(withState<{ isLoading: boolean }>({ isLoading: false }), withTasks());

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        rootStore,
        { provide: TasksApiService, useValue: mockTaskApiService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: HomeDeviceApiService, useValue: mockHomeDeviceApiService },
      ],
    });

    jest.clearAllMocks();
  });

  it('should fetch tasks list successfully', () => {
    const tasks: AutomaticTask[] = [{ id: 1, name: 'Test', isActive: false, actions: [], daysOfWeek: null }];
    mockTaskApiService.getTaskList.mockReturnValue(of(tasks));
    const store = TestBed.inject(rootStore);

    store.fetchTasks();

    expect(mockTaskApiService.getTaskList).toHaveBeenCalled();
    expect(store.entities().length).toBe(1);
    expect(store.entities()[0].name).toBe('Test');
  });

  it('should handle error on fetchTasks', () => {
    mockTaskApiService.getTaskList.mockReturnValue(throwError(() => new Error('fail')));
    const store = TestBed.inject(rootStore);

    store.fetchTasks();

    expect(mockMessageService.add).toHaveBeenCalledWith({ summary: 'Błąd pobierania listy zadań!', severity: 'error' });
    expect(store.isLoading()).toBe(false);
  });

  it('should change task status and refetch', () => {
    mockTaskApiService.setTaskStatus.mockReturnValue(of({}));
    mockTaskApiService.getTaskList.mockReturnValue(of([]));
    const store = TestBed.inject(rootStore);
    store.changeTaskStatus({ id: 1, isActive: true });

    expect(mockTaskApiService.setTaskStatus).toHaveBeenCalledWith({ id: 1, active: true });
    expect(mockMessageService.add).toHaveBeenCalledWith({
      summary: 'Status zadania został zmieniony',
      severity: 'success',
    });
    expect(mockTaskApiService.getTaskList).toHaveBeenCalledTimes(1);
    expect(store.isLoading()).toBe(false);
  });

  it('should delete task and refetch', () => {
    mockTaskApiService.deleteTask.mockReturnValue(throwError(() => new Error('fail')));
    const store = TestBed.inject(rootStore);
    store.deleteTask(123);

    expect(mockTaskApiService.deleteTask).toHaveBeenCalledWith({ id: 123 });
    expect(mockMessageService.add).toHaveBeenCalledWith({
      summary: 'Błąd podczas usuwania zadania!',
      severity: 'error',
    });
    expect(mockTaskApiService.getTaskList).toHaveBeenCalledTimes(1);
    expect(store.isLoading()).toBe(false);
  });

  it('should handle delete error', () => {
    mockTaskApiService.deleteTask.mockReturnValue(of({}));
    mockTaskApiService.getTaskList.mockReturnValue(of([]));
    const store = TestBed.inject(rootStore);
    store.deleteTask(123);

    expect(mockTaskApiService.deleteTask).toHaveBeenCalledWith({ id: 123 });
    expect(mockMessageService.add).toHaveBeenCalledWith({
      summary: 'Zadanie usunięte.',
      severity: 'success',
    });
    expect(mockTaskApiService.getTaskList).toHaveBeenCalledTimes(1);
    expect(store.isLoading()).toBe(false);
  });

  it('should create a task and refetch', () => {
    mockTaskApiService.createTask.mockReturnValue(of({}));
    mockTaskApiService.getTaskList.mockReturnValue(of([]));
    const store = TestBed.inject(rootStore);
    store.createTask({ name: 'New task', actions: [] });

    expect(mockTaskApiService.createTask).toHaveBeenCalled();
    expect(mockMessageService.add).toHaveBeenCalledWith({ summary: 'Utworzono zadanie', severity: 'success' });
    expect(mockTaskApiService.getTaskList).toHaveBeenCalledTimes(1);
    expect(store.isLoading()).toBe(false);
  });

  it('should update a task and refetch', () => {
    mockTaskApiService.updateTask.mockReturnValue(of({}));
    mockTaskApiService.getTaskList.mockReturnValue(of([]));
    const store = TestBed.inject(rootStore);
    store.updateTask({
      id: 7,
      name: 'Edit',
      isActive: false,
      actions: [],
      daysOfWeek: null,
    });

    expect(mockTaskApiService.updateTask).toHaveBeenCalledWith(expect.objectContaining({ id: '7' }));
    expect(mockMessageService.add).toHaveBeenCalledWith({
      summary: 'Modyfikacja zakończona pomyślnie',
      severity: 'success',
    });
    expect(mockTaskApiService.getTaskList).toHaveBeenCalledTimes(1);
    expect(store.isLoading()).toBe(false);
  });

  it('should handle error update', () => {
    mockTaskApiService.updateTask.mockReturnValue(throwError(() => new Error('fail')));
    mockTaskApiService.getTaskList.mockReturnValue(of([]));
    const store = TestBed.inject(rootStore);
    store.updateTask({
      id: 7,
      name: 'Edit',
      actions: [],
      isActive: false,
      daysOfWeek: null,
    });

    expect(mockTaskApiService.updateTask).toHaveBeenCalledWith(expect.objectContaining({ id: '7' }));
    expect(mockMessageService.add).toHaveBeenCalledWith({
      summary: 'Błąd modyfikacji zadania',
      severity: 'error',
    });
    expect(mockTaskApiService.getTaskList).toHaveBeenCalledTimes(1);
    expect(store.isLoading()).toBe(false);
  });

  it('should fetch device list successfully', () => {
    const devices: HomeDeviceDetailsDtoApiModel[] = [
      {
        id: 1,
        name: 'Device 1',
        homeDeviceId: '',
        isOnline: false,
        signalStrength: 0,
        type: 0,
        actions: [
          {
            currentValue: null,
            enumValues: null,
            key: '',
            range: null,
            type: 'number',
            unit: null,
          },
        ],
        battery: null,
        description: '',
        model: '',
        params: {},
        vendor: '',
        mainActionKey: 'state',
        mainParamKey: 'test',
        isOnMainPage: false,
      },
    ];
    mockHomeDeviceApiService.getAllDevices.mockReturnValue(of(devices));
    const store = TestBed.inject(rootStore);

    store.getAvailableDevices();

    expect(mockHomeDeviceApiService.getAllDevices).toHaveBeenNthCalledWith(1, {
      body: {},
    });
    expect(store.availableDevices().length).toBe(1);
    expect(store.availableDevices()[0].name).toBe('Device 1');
    expect(store.isLoading()).toBe(false);
  });

  it('should handle fetch device error', () => {
    mockHomeDeviceApiService.getAllDevices.mockReturnValue(throwError(() => new Error('fail')));
    const store = TestBed.inject(rootStore);

    store.getAvailableDevices();

    expect(mockHomeDeviceApiService.getAllDevices).toHaveBeenNthCalledWith(1, {
      body: {},
    });
    expect(store.isLoading()).toBe(false);
  });
});
