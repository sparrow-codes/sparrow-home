import { DateUtils } from './date-utils';

describe('DateUtils', () => {
  it('should add an hour to date', () => {
    expect(DateUtils.addHours(new Date('2024-10-17T20:00'), 2).toString().includes('Thu Oct 17 2024 22:00:00')).toBe(
      true
    );
  });

  it('should minus an hour from date', () => {
    expect(DateUtils.addHours(new Date('2024-10-17T20:00'), -2).toString().includes('Thu Oct 17 2024 18:00:00')).toBe(
      true
    );
  });
});
