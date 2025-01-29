export interface BridgeEventMessage {
  type: 'device_joined' | 'device_interview' | 'device_leave' | 'device_announce';
  data: {
    friendly_name: string;
    ieee_address: string;
    status: string;
  };
}
