import { toCronWeekday } from './to-cron-weekday';

describe('toCronWeekday', () => {
  it('should map cron weekday', () => {
    expect(toCronWeekday([1])).toBe('1');
    expect(toCronWeekday([1, 2])).toBe('1,2');
    expect(toCronWeekday([1, 2, 3])).toBe('1,2,3');
    expect(toCronWeekday([])).toBe('*');
    expect(toCronWeekday(null as never)).toBe('*');
    expect(toCronWeekday('' as never)).toBe('*');
    expect(toCronWeekday(undefined as never)).toBe('*');
    expect(toCronWeekday({} as never)).toBe('*');
    expect(toCronWeekday(['1', '2', '3'] as never)).toBe('1,2,3');
  });
});
