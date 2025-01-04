export class CircularPumpPreferences {
  public isActive?: boolean;
  public tuyaDeviceId?: string;
  public scheduledStartTime?: Date;
  public scheduledEndTime?: Date;

  public canBeActivated(): boolean {
    return !!this.tuyaDeviceId && !!this.scheduledStartTime && !!this.scheduledEndTime;
  }
}
