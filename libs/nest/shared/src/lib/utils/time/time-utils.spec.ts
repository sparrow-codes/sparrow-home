import { TimeUtils } from './time-utils';

describe('Time Utils', () => {
  it('should calculate time interval between two dates in seconds', () => {
    const now: Date = new Date(Date.now());
    const todayWithTwoHours: Date = new Date(Date.now());
    todayWithTwoHours.setHours(todayWithTwoHours.getHours() + 1);

    expect(TimeUtils.getTimeIntervalInSeconds(now, todayWithTwoHours)).toBe(3600);
  });

  it('should return zero if from date is later than to date', () => {
    const now: Date = new Date(Date.now());
    const todayWithTwoHours: Date = new Date(Date.now());
    todayWithTwoHours.setHours(todayWithTwoHours.getHours() - 1);

    expect(TimeUtils.getTimeIntervalInSeconds(now, todayWithTwoHours)).toBe(0);
  });

  it('should calculate seconds between 14:30 and 22:45', () => {
    const from: Date = new Date('2024-12-27T13:30:00.000Z');
    const to: Date = new Date('2024-12-27T21:45:00.000Z');

    expect(TimeUtils.getTimeIntervalInSeconds(from, to)).toBe(29700);
  });
});
