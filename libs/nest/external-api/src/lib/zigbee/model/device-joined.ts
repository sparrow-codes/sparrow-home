export interface DeviceJoined {
  friendly_name: string;
  ieee_address: string;
  definition?: {
    model?: string;
    vendor?: string;
    description?: string;
    exposes?: Expose[];
  };
}

export type Expose = {
  type?: string;
  property?: string; // klucz w payloadzie MQTT
  name?: string; // bywa zamiast property (fallback)
  access?: number; // bitmask: 1=state, 2=set, 4=get
  values?: string[]; // dla enum
  value_min?: number; // dla numeric
  value_max?: number; // dla numeric
  value_step?: number; // dla numeric
  unit?: string; // dla numeric
  features?: Expose[]; // composite/switch zagnieżdżone pola
  endpoint?: string; // gdy expose dotyczy konkretnego endpointu
  [k: string]: unknown;
};
