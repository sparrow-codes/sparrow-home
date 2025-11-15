export interface DeviceAction {
  key: string;
  type: 'boolean' | 'number' | 'enum' | 'unknown';
  enumValues: string[];
  unit: string | null;
  range: { min?: number; max?: number } | null;
  currentValue: unknown | null;
}
