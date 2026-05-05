#!/bin/sh

CONFIG=/app/data/configuration.yaml
TEMPLATE=/app/template/configuration.yaml.template

echo "Checking Zigbee2MQTT config..."

if [ ! -f "$CONFIG" ]; then
  echo "Generating configuration.yaml from template..."
  envsubst < "$TEMPLATE" > "$CONFIG"
else
  echo "configuration.yaml already exists, skipping"
fi

exec node index.js
