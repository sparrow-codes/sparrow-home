import { TaskDtoApiModel } from '@sparrow-home/api';

import { AutomaticTask } from '../../../model';
import { toAutomaticTask } from './to-automatic-task';

describe('toTaskEntity', () => {
  it('should map all fields correctly for valid ISO date strings', () => {
    const input: TaskDtoApiModel = {
      id: 42,
      isActive: true,
      name: 'Morning watering',
      daysOfWeek: [1, 2],
      actions: [],
    };

    const result: AutomaticTask = toAutomaticTask(input as never);

    expect(result.id).toBe(42);
    expect(result.isActive).toBe(true);
    expect(result.name).toBe('Morning watering');
    expect(result.daysOfWeek).toBe(input.daysOfWeek);
  });
});
