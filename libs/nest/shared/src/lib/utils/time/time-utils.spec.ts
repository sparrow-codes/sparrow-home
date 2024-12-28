import { TimeUtils } from './time-utils';

describe('Time Utils', () => {
  it('should calculate time interval between two dates in milis', () => {
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
});
