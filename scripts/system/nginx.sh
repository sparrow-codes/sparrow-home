#!/usr/bin/env bash
set -euo pipefail

[[ "${EUID:-$(id -u)}" -eq 0 ]] || {
  echo "ERROR: Run as root (sudo)."
  exit 1
}

echo "Installing nginx..."

export DEBIAN_FRONTEND=noninteractive

apt-get update -y
apt-get install -y nginx

echo "Enabling and starting nginx service..."
systemctl enable nginx
systemctl start nginx

echo "Nginx status:"
systemctl --no-pager status nginx | sed -n '1,10p'
