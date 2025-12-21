#!/usr/bin/env bash
set -euo pipefail

[[ "${EUID:-$(id -u)}" -eq 0 ]] || { echo "ERROR: Run as root (sudo)."; exit 1; }

echo "Sparrow Home - Server Preparation Script"
echo "--------------------------------------"

echo "This script will install:"
echo "- Docker"

read -p "Continue? [y/N]: " answer

if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
  echo "Starting installation..."
else
  echo "Canceled."
  exit 0
fi

bash ./scripts/system/docker.sh
echo "--------------------------------------"

echo "Server preparation completed."
