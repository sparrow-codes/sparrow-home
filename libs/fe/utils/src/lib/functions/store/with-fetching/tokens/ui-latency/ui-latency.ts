import { UiLatencyConfig } from './model/ui-latency';

export const UI_LATENCY: UiLatencyConfig = {
  skeleton: { showDelay: 250, minVisible: 300 },
  spinner: { showDelay: 250, minVisible: 300 },
  progress: { showDelay: 250, minVisible: 800 },
  refresh: { minVisible: 500 },
} as const;
