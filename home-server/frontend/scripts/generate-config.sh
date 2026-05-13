#!/bin/sh
set -eu

TAILSCALE_DOMAIN="${TAILSCALE_DOMAIN:-}"
OUT="/etc/caddy/Caddyfile"

if [ -z "${pushPublicKey:-}" ]; then
  echo "ERROR: Environment variable pushPublicKey is not set"
  exit 1
fi

echo "Generating frontend config.json..."

cat > /usr/share/caddy/config.json <<EOF
{
  "pushPublicKey": "${pushPublicKey}"
}
EOF

if [ -n "$TAILSCALE_DOMAIN" ]; then
  echo "Generating Caddyfile for domain: ${TAILSCALE_DOMAIN}"

  cat > "$OUT" <<EOF
${TAILSCALE_DOMAIN} {
    tls {
        get_certificate tailscale
    }

    root * /usr/share/caddy

    handle /api/* {
        reverse_proxy backend:3000
    }

    handle {
        try_files {path} /index.html
        file_server
    }

    @no-cache {
        path /config.json /index.html
    }
    header @no-cache Cache-Control "no-store, no-cache, must-revalidate"

    @static {
        path_regexp static \.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$
    }
    header @static Cache-Control "public, max-age=604800, immutable"

    log {
        output stdout
    }
}
EOF

else
  echo "TAILSCALE_DOMAIN not set, exposing frontend on server IP"

  cat > "$OUT" <<EOF
:80 {
    root * /usr/share/caddy

    handle /api/* {
        reverse_proxy backend:3000
    }

    handle {
        try_files {path} /index.html
        file_server
    }

    @no-cache {
        path /config.json /index.html
    }
    header @no-cache Cache-Control "no-store, no-cache, must-revalidate"

    @static {
        path_regexp static \.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$
    }
    header @static Cache-Control "public, max-age=604800, immutable"

    log {
        output stdout
    }
}
EOF

fi

echo "Starting Caddy..."

exec caddy run --config "$OUT" --adapter caddyfile
