export class SchedulePreferences {
  public isActive?: boolean;
  public homeDeviceId?: string;
  public startTime?: Date;
  public endTime?: Date;

  public canBeActivated(): boolean {
    return !!this.homeDeviceId && !!this.startTime && !!this.endTime;
  }
}
