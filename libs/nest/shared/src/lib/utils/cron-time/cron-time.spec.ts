import { getEverydayCronTime } from './cron-time';

describe('getEverydayCronTime', () => {
  it('should return correct cron string for a full hour', () => {
    const date: Date = new Date(2025, 0, 1, 14, 0); // 14:00
    expect(getEverydayCronTime(date)).toBe('0 0 14 * * *');
  });

  it('should return correct cron string for an hour with minutes', () => {
    const date: Date = new Date(2025, 0, 1, 9, 30); // 09:30
    expect(getEverydayCronTime(date)).toBe('0 30 9 * * *');
  });

  it('should handle single-digit hours and minutes', () => {
    const date: Date = new Date(2025, 0, 1, 5, 7); // 05:07
    expect(getEverydayCronTime(date)).toBe('0 7 5 * * *');
  });

  it('should handle midnight (00:00)', () => {
    const date: Date = new Date(2025, 0, 1, 0, 0); // midnight
    expect(getEverydayCronTime(date)).toBe('0 0 0 * * *');
  });

  it('should handle the last minute of the day (23:59)', () => {
    const date: Date = new Date(2025, 0, 1, 23, 59); // 23:59
    expect(getEverydayCronTime(date)).toBe('0 59 23 * * *');
  });
});
