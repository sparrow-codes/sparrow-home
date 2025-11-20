import { TaskAction } from '../../../model';
import { toActionJobDto } from './to-action-job-dto';

describe('toActionJobDto', () => {
  const task: TaskAction = {
    zigbeeDeviceId: 'abc',
    deviceName: 'name',
    deviceDescription: 'description',
    executionTime: new Date(),
    daysOfWeek: null,
    action: {
      key: 'switch',
      type: 'number',
      enumValues: [],
      unit: null,
      range: null,
      currentValue: 'on',
    },
  };

  it('should map zigbeeDeviceId', () => {
    expect(toActionJobDto(task).assignedDeviceId).toBe(task.zigbeeDeviceId);
  });

  it('should map execution time', () => {
    expect(toActionJobDto(task).executionTime).toEqual(task.executionTime.toISOString());
  });

  it('should create payload string from action', () => {
    expect(toActionJobDto(task).payload).toStrictEqual({ switch: 'on' });
  });

  it('should map days of the week', () => {
    expect(toActionJobDto(task).daysOfTheWeek).toBe(task.daysOfWeek);
  });
});
