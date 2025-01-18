export class CircularPumpPreferences {
  public isActive?: boolean;
  public homeDeviceId?: string;
  public scheduledStartTime?: Date;
  public scheduledEndTime?: Date;

  public canBeActivated(): boolean {
    return !!this.homeDeviceId && !!this.scheduledStartTime && !!this.scheduledEndTime;
  }
}
