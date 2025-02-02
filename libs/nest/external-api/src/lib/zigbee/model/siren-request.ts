export interface SirenRequest {
  warning: {
    mode: 'stop' | 'burglar' | 'fire' | 'emergency' | 'police_panic' | 'fire_panic' | 'emergency_panic';
    level: 'low' | 'medium' | 'high' | 'very_high';
    strobe_level: 'low' | 'medium' | 'high' | 'very_high';
    strobe: boolean;
    strobe_duty_cycle?: number;
    duration: number;
  };
}
