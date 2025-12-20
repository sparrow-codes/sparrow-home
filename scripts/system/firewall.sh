#!/usr/bin/env bash
set -euo pipefail

LAN_CIDR="${LAN_CIDR:-192.168.0.0/24}"

CURRENT_SSH_IP=""
if [[ -n "${SSH_CONNECTION:-}" ]]; then
  CURRENT_SSH_IP="$(echo "${SSH_CONNECTION}" | awk '{print $1}')"
fi

[[ "${EUID:-$(id -u)}" -eq 0 ]] || {
  echo "ERROR: Run as root (sudo)."
  exit 1
}

echo "Configuring firewall (LAN only)..."

apt-get update || true
apt-get install -y ufw

# Reset UFW to known state
ufw disable || true
ufw --force reset

# localhost
ufw allow in on lo
ufw allow out on lo

# If we detected current SSH client IP, allow it explicitly to avoid lockout
if [[ -n "${CURRENT_SSH_IP}" ]]; then
  echo "Detected SSH client IP: ${CURRENT_SSH_IP}. Allowing SSH from this IP to avoid lockout."
  ufw allow from ${CURRENT_SSH_IP} to any port 22 proto tcp
fi

# LAN access (allow SSH/HTTP/HTTPS from LAN)
ufw allow from ${LAN_CIDR} to any port 22 proto tcp
ufw allow from ${LAN_CIDR} to any port 80 proto tcp
ufw allow from ${LAN_CIDR} to any port 443 proto tcp

# defaults
ufw default deny incoming
ufw default allow outgoing

ufw --force enable

echo "Firewall status:"
ufw status verbose
