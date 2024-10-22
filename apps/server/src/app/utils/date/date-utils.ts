export class DateUtils {
  public static addHours(date: Date, hours: number): Date {
    const newDate: Date = new Date(date);
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
  }
}
