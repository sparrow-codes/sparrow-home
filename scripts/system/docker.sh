#!/usr/bin/env bash
set -euo pipefail

[[ "${EUID:-$(id -u)}" -eq 0 ]] || {
  echo "ERROR: Run as root (sudo)."
  exit 1
}

echo "Installing Docker (official repo) + docker compose..."

export DEBIAN_FRONTEND=noninteractive

# prerequisites
apt-get update -y
apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

# add Docker GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# add Docker repo
ARCH="$(dpkg --print-architecture)"
CODENAME="$(lsb_release -cs)"

echo \
  "deb [arch=${ARCH} signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu ${CODENAME} stable" \
  > /etc/apt/sources.list.d/docker.list

# install Docker + compose plugin
apt-get update -y
apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin

# enable Docker daemon
systemctl enable docker
systemctl start docker

echo "Docker installed:"
docker --version
docker compose version
