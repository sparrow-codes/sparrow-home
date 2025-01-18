export interface IkeaSwitchStatusResponse {
  linkquality: number;
  power_on_behavior: string;
  state: string;
  update: {
    installed_version: number;
    latest_version: number;
    state: string;
  };
}
