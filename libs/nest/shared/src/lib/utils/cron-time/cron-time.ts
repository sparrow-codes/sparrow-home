export function getEverydayCronTime(time: Date): string {
  return `0 ${time.getMinutes()} ${time.getHours()} * * *`;
}
