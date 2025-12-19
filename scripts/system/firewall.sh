#!/usr/bin/env bash
set -euo pipefail

LAN_CIDR="192.168.0.0/24"

[[ "${EUID:-$(id -u)}" -eq 0 ]] || {
  echo "ERROR: Run as root (sudo)."
  exit 1
}

echo "Configuring firewall (LAN only)..."

apt-get install -y ufw

ufw disable || true
ufw --force reset

# localhost
ufw allow in on lo
ufw allow out on lo

# LAN access
ufw allow from ${LAN_CIDR} to any port 22 proto tcp
ufw allow from ${LAN_CIDR} to any port 80 proto tcp
ufw allow from ${LAN_CIDR} to any port 443 proto tcp

# defaults
ufw default deny incoming
ufw default allow outgoing

ufw --force enable

echo "Firewall status:"
ufw status verbose
