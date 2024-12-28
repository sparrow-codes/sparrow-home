export abstract class TimeUtils {
  public static getTimeIntervalInSeconds(from: Date, to: Date): number {
    if (from >= to) {
      return 0;
    }

    return Math.floor((from.getTime() - to.getTime()) / 1000) * -1;
  }
}
