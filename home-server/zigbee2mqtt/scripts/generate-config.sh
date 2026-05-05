#!/bin/sh

CONFIG=/app/data/configuration.yaml

if [ ! -f "$CONFIG" ]; then
  echo "Generating Zigbee2MQTT config..."

  cat > "$CONFIG" <<EOF
homeassistant: false

frontend:
  port: 8080

mqtt:
  base_topic: zigbee2mqtt
  server: mqtt://mosquitto:1883

serial:
  port: ${ZIGBEE_SERIAL_PORT}
  adapter: ${ZIGBEE_ADAPTER}

advanced:
  log_level: info
  channel: 11
  network_key: GENERATE

permit_join: false
EOF

else
  echo "Config already exists"
fi

exec node index.js
