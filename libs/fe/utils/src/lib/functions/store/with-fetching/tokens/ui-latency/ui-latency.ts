import { UiLatencyConfig } from './model/ui-latency';

export const UI_LATENCY: UiLatencyConfig = {
  skeleton: { showDelay: 0, minVisible: 0 },
  spinner: { showDelay: 0, minVisible: 0 },
  progress: { showDelay: 0, minVisible: 0 },
  refresh: { minVisible: 0 },
} as const;
