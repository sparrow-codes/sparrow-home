import { TaskActionDtoApiModel } from '@sparrow-home/api';

import { TaskAction } from '../../../model/task-action';
import { toTaskAction } from './to-task-action';

describe('toTaskAction', () => {
  const taskActionDto: TaskActionDtoApiModel = {
    action: {
      currentValue: null,
      enumValues: null,
      key: '',
      range: null,
      type: 'number',
      unit: null,
    },
    zigbeeDeviceId: 'abc',
    deviceDescription: 'description',
    deviceName: 'device name',
    executionTime: '2023-01-01T00:00:00.000Z',
    daysOfTheWeek: [1, 2],
  };

  it('should map task action', () => {
    const taskAction: TaskAction = toTaskAction(taskActionDto);

    expect(taskAction.zigbeeDeviceId).toBe(taskActionDto.zigbeeDeviceId);
    expect(taskAction.executionTime).toEqual(new Date(taskActionDto.executionTime));
    expect(taskAction.action.key).toEqual(taskActionDto.action.key);
    expect(taskAction.action.type).toEqual(taskActionDto.action.type);
    expect(taskAction.action.unit).toEqual(taskActionDto.action.unit);
    expect(taskAction.action.range).toEqual(taskActionDto.action.range);
    expect(taskAction.action.currentValue).toEqual(taskActionDto.action.currentValue);
    expect(taskAction.deviceName).toEqual(taskActionDto.deviceName);
    expect(taskAction.deviceDescription).toEqual(taskActionDto.deviceDescription);
    expect(taskAction.daysOfWeek).toEqual(taskActionDto.daysOfTheWeek);
  });
});
