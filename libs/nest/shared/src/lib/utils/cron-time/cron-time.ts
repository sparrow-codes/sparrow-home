import { toCronWeekday } from './cron-week-day/to-cron-weekday';

export function getCronTime(time: Date, weekdays: number[] | null = null): string {
  return `0 ${time.getMinutes()} ${time.getHours()} * * ${toCronWeekday(weekdays)}`;
}
