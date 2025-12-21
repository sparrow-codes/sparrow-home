#!/usr/bin/env bash
set -euo pipefail

LAN_CIDR="${LAN_CIDR:-192.168.0.0/24}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --lan-cidr) LAN_CIDR="$2"; shift 2 ;;
    *) shift ;;
  esac
done

[[ "${EUID:-$(id -u)}" -eq 0 ]] || { echo "ERROR: Run as root (sudo)."; exit 1; }

echo "Configuring firewall (LAN only). LAN_CIDR=${LAN_CIDR}"

apt-get update -y
apt-get install -y ufw

ufw disable || true
ufw --force reset

ufw allow in on lo
ufw allow out on lo

# Failsafe: keep current SSH client reachable
if [[ -n "${SSH_CONNECTION:-}" ]]; then
  SSH_CLIENT_IP="$(echo "$SSH_CONNECTION" | awk '{print $1}')"
  echo "Failsafe allow SSH from current client IP: ${SSH_CLIENT_IP}"
  ufw allow from "${SSH_CLIENT_IP}" to any port 22 proto tcp
fi

# LAN rules
ufw allow from "${LAN_CIDR}" to any port 22 proto tcp
ufw allow from "${LAN_CIDR}" to any port 80 proto tcp
ufw allow from "${LAN_CIDR}" to any port 443 proto tcp

ufw default deny incoming
ufw default allow outgoing

ufw --force enable
ufw status verbose
