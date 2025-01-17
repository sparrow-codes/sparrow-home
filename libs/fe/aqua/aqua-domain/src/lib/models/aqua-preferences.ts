export class AquaPreferences {
  public isActive?: boolean;
  public homeDeviceId?: string;
  public lightStartTime?: Date;
  public lightEndTime?: Date;

  public canBeActivated(): boolean {
    return !!this.homeDeviceId && !!this.lightStartTime && !!this.lightEndTime;
  }
}
