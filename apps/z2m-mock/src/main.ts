import fs from 'node:fs';
import mqtt, { IClientOptions, MqttClient } from 'mqtt';

type LightState = { state: 'ON' | 'OFF'; brightness?: number };
type SensorState = { temperature?: number; humidity?: number };
type Device = {
  friendly_name: string;
  type: 'light' | 'sensor';
  state: LightState | SensorState;
};

const URL = process.env.MQTT_URL ?? 'mqtt://localhost:1883';
const PREFIX = process.env.Z2M_PREFIX ?? 'zigbee2mqtt';
const DEVICES_PATH = process.env.Z2M_DEVICES ?? `${__dirname}/devices.json`;
const TICK_MS = Number(process.env.Z2M_TICK_MS ?? 20000);

const devices: Device[] = JSON.parse(fs.readFileSync(DEVICES_PATH, 'utf8'));

const opts: IClientOptions = {
  clientId: 'z2m-mock-' + Math.random().toString(16).slice(2),
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

const client: MqttClient = mqtt.connect(URL, opts);

function retainedPublish(topic: string, payload: unknown, qos: 0 | 1 | 2 = 1) {
  const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
  client.publish(topic, data, { retain: true, qos });
}

client.on('connect', () => {
  console.log(`[z2m-mock] connected: ${URL}`);
  // 1) Bridge info
  retainedPublish(`${PREFIX}/bridge/state`, 'online');
  retainedPublish(`${PREFIX}/bridge/info`, {
    version: '1.38.0-mock',
    commit: 'mock',
    config: { homeassistant: false, permit_join: false },
  });
  // 2) Devices list (uproszczone)
  retainedPublish(
    `${PREFIX}/bridge/devices`,
    devices.map((d) => ({
      friendly_name: d.friendly_name,
      ieee_address: `0xMOCK${d.friendly_name}`,
      type: d.type === 'light' ? 'Router' : 'EndDevice',
      interview_completed: true,
    }))
  );
  // 3) Initial states
  devices.forEach((d) => retainedPublish(`${PREFIX}/${d.friendly_name}`, d.state));
  // 4) Subscriptions
  client.subscribe(`${PREFIX}/+/set`);
  client.subscribe(`${PREFIX}/+/get`);
  // 5) Sensor tick
  setInterval(() => {
    devices
      .filter((d) => d.type === 'sensor')
      .forEach((d) => {
        const s = d.state as SensorState;
        if (typeof s.temperature === 'number') {
          s.temperature = +(s.temperature + (Math.random() * 0.2 - 0.1)).toFixed(2);
        }
        if (typeof s.humidity === 'number') {
          s.humidity = Math.max(30, Math.min(70, s.humidity + (Math.random() * 2 - 1)));
        }
        retainedPublish(`${PREFIX}/${d.friendly_name}`, s);
      });
  }, TICK_MS);
});

client.on('message', (topic, payloadBuf) => {
  console.log(`[z2m-mock] message: ${topic} ${payloadBuf.toString()}`);
  const str = payloadBuf.toString();
  const m = topic.match(new RegExp(`^${PREFIX}/([^/]+)/(set|get)$`));
  if (!m) return;
  const friendly = m[1];
  const action = m[2] as 'set' | 'get';
  const dev = devices.find((d) => d.friendly_name === friendly);
  if (!dev) return;

  let data: any = str;
  try {
    data = JSON.parse(str);
  } catch {}

  if (dev.type === 'light' && action === 'set') {
    const state = dev.state as LightState;
    if (typeof data === 'string') {
      const v = data.toUpperCase();
      if (v === 'ON' || v === 'OFF') state.state = v;
    } else {
      if (typeof data.state === 'string') state.state = data.state.toUpperCase() as 'ON' | 'OFF';
      if (typeof data.brightness === 'number') state.brightness = data.brightness;
    }
    retainedPublish(`${PREFIX}/${friendly}`, state);
  }

  if (dev.type === 'sensor' && action === 'get') {
    retainedPublish(`${PREFIX}/${friendly}`, dev.state);
  }
});

client.on('error', (e) => console.error('[z2m-mock] mqtt error', e));
