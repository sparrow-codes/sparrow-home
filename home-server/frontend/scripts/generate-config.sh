#!/bin/sh

set -euo pipefail

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "${pushPublicKey:-}" ]; then
  echo "ERROR: Environment variable pushPublicKey is not set"
  exit 1
fi

mkdir -p home-server/frontend/data

echo "Creating config.json..."

cat > home-server/frontend/data/config.json <<EOF
{
  "webPushPublicKey": "${pushPublicKey}"
}
EOF

echo "config.json created successfully"
