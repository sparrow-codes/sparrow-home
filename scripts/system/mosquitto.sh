#!/usr/bin/env bash
set -euo pipefail

[[ "${EUID:-$(id -u)}" -eq 0 ]] || {
  echo "ERROR: Run as root (sudo)."
  exit 1
}

echo "Installing Mosquitto (MQTT broker)..."

export DEBIAN_FRONTEND=noninteractive

apt-get update -y
apt-get install -y mosquitto mosquitto-clients

echo "Enabling and starting Mosquitto service..."
systemctl enable mosquitto
systemctl start mosquitto

echo "Mosquitto status:"
systemctl --no-pager status mosquitto | sed -n '1,10p'
