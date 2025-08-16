import { toTaskDto } from './to-task-dto';

describe('toTaskDto', () => {
  it('maps all fields and device list to IDs', () => {
    const task = {
      id: 't1',
      name: 'Garden lights',
      startTime: '2025-08-08T20:00:00.000Z',
      endTime: '2025-08-09T04:00:00.000Z',
      isActive: true,
      atSunset: false,
      homeDevices: [{ id: 'dev-1' }, { id: 'dev-2' }],
    } as any;

    const dto = toTaskDto(task);

    expect(dto).toEqual({
      id: 't1',
      name: 'Garden lights',
      startTime: '2025-08-08T20:00:00.000Z',
      endTime: '2025-08-09T04:00:00.000Z',
      isActive: true,
      atSunset: false,
      assignedDevices: ['dev-1', 'dev-2'],
    });
  });

  it('returns empty assignedDevices when homeDevices is undefined', () => {
    const task = {
      id: 't2',
      name: 'Sprinklers',
      startTime: '2025-08-08T05:00:00.000Z',
      endTime: '2025-08-08T05:15:00.000Z',
      isActive: false,
      atSunset: true,
    } as any;

    const dto = toTaskDto(task);

    expect(dto.assignedDevices).toEqual([]);
  });

  it('sets name to empty string when input name is null/undefined', () => {
    const taskNull = {
      id: 't3',
      name: null,
      startTime: '2025-08-08T05:00:00.000Z',
      endTime: '2025-08-08T05:15:00.000Z',
      isActive: true,
      atSunset: false,
    } as any;

    const taskUndef = {
      id: 't4',
      startTime: '2025-08-08T05:00:00.000Z',
      endTime: '2025-08-08T05:15:00.000Z',
      isActive: true,
      atSunset: false,
    } as any;

    expect(toTaskDto(taskNull).name).toBe('');
    expect(toTaskDto(taskUndef).name).toBe('');
  });

  it('handles empty homeDevices array', () => {
    const task = {
      id: 't5',
      name: 'Empty devices',
      startTime: '2025-08-08T05:00:00.000Z',
      endTime: '2025-08-08T05:15:00.000Z',
      isActive: true,
      atSunset: false,
      homeDevices: [],
    } as any;

    const dto = toTaskDto(task);
    expect(dto.assignedDevices).toEqual([]);
  });

  it('does not mutate the input object', () => {
    const devices = [{ id: 'dev-1' }];
    const task = {
      id: 't6',
      name: 'No mutation',
      startTime: '2025-08-08T05:00:00.000Z',
      endTime: '2025-08-08T05:15:00.000Z',
      isActive: false,
      atSunset: false,
      homeDevices: devices,
    } as any;

    const before = JSON.stringify(task);
    void toTaskDto(task);
    const after = JSON.stringify(task);

    expect(after).toBe(before);
  });
});
