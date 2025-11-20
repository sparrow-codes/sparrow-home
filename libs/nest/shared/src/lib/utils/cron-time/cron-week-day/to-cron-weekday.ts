export function toCronWeekday(weekdays: number[] | null): string {
  if (!Array.isArray(weekdays) || weekdays.length === 0) {
    return '*';
  }

  return weekdays.join(',');
}
