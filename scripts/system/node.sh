#!/usr/bin/env bash
set -euo pipefail

[[ "${EUID:-$(id -u)}" -eq 0 ]] || { echo "ERROR: Run as root (sudo)."; exit 1; }

NODE_MAJOR="20"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --node-major)
      [[ -n "${2:-}" ]] || { echo "ERROR: --node-major requires a value"; exit 1; }
      NODE_MAJOR="$2"
      shift 2
      ;;
    --node-major=*)
      NODE_MAJOR="${1#*=}"
      shift 1
      ;;
    -h|--help)
      echo "Usage: sudo $0 [--node-major 18|20|22]"
      exit 0
      ;;
    *)
      echo "ERROR: Unknown argument: $1"
      exit 1
      ;;
  esac
done

echo "Installing Node.js ${NODE_MAJOR}.x via NodeSource (APT)..."

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl ca-certificates

curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
apt-get install -y nodejs

echo "Installed:"
node -v
npm -v
