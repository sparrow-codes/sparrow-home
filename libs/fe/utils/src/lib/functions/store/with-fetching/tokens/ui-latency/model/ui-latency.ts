export interface UiLatencyTiming {
  showDelay: number;
  minVisible: number;
}

export interface UiRefreshLatency {
  minVisible: number;
}

export interface UiLatencyConfig {
  skeleton: UiLatencyTiming;
  spinner: UiLatencyTiming;
  progress: UiLatencyTiming;
  refresh: UiRefreshLatency;
}
