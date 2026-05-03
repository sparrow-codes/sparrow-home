# syntax=docker/dockerfile:1

# --- Etap DEPS ---
FROM node:22-slim AS deps
WORKDIR /workspace
COPY package.json package-lock.json ./
RUN npm ci

# --- Etap BUILD ---
FROM node:22-slim AS build
WORKDIR /workspace
COPY --from=deps /workspace/node_modules ./node_modules
COPY . .
RUN npm run build:mobile

# --- Etap RUNNER (Caddy) ---
FROM caddy:2.8-alpine AS runner

# Kopiujemy plik konfiguracyjny (Caddyfile)
COPY home-server/frontend/Caddyfile /etc/caddy/Caddyfile

# Kopiujemy zbudowaną aplikację Angular (zmień ścieżkę jeśli jest inna)
COPY --from=build /workspace/dist/apps/sparrow-home-mobile/browser /usr/share/caddy
RUN chmod -R 755 /usr/share/caddy

# Caddy domyślnie używa portów 80 i 443
EXPOSE 80 443 443/udp

# Caddy nie wymaga CMD, domyślnie uruchamia się z plikiem w /etc/caddy/Caddyfile
