export class AquaPreferences {
  public isActive?: boolean;
  public tuyaDeviceId?: string;
  public lightStartTime?: Date;
  public lightEndTime?: Date;

  public canBeActivated(): boolean {
    return !!this.tuyaDeviceId && !!this.lightStartTime && !!this.lightEndTime;
  }
}
