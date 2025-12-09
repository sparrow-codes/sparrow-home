import { DeviceState } from './device-state';

export interface DeviceProfile {
  deviceIdentity: DeviceIdentity;
  deviceDefinition: DeviceDefinition;
  actions: DeviceAction[];
  readonlyFields: ReadonlyField[];
  state: DeviceState;
}

interface DeviceIdentity {
  ieee: string;
  friendlyName: string;
}

interface DeviceDefinition {
  model?: string;
  vendor?: string;
  description?: string;
}

export interface DeviceAction extends Exposed {
  type: 'boolean' | 'number' | 'enum' | 'unknown';
  writable: true;
  readable: boolean;
  enumValues?: string[];
  unit?: string;
  range?: object;
}

export interface ReadonlyField extends Exposed {
  type: 'number' | 'boolean' | 'string' | 'enum';
  unit?: string;
  enumValues?: string[];
  range?: { min?: number; max?: number; step?: number };
}

export interface Exposed {
  key: string;
  appearsInState: boolean;
  supportsGet: boolean;
  path: string[];
}
