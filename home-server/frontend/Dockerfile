# syntax=docker/dockerfile:1

FROM node:22-slim AS deps
WORKDIR /workspace
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-slim AS build
WORKDIR /workspace
COPY --from=deps /workspace/node_modules ./node_modules
COPY . .
RUN npm run build:mobile

FROM caddy:2.8-alpine AS runner

COPY --from=build /workspace/dist/apps/sparrow-home-mobile/browser /usr/share/caddy
RUN chmod -R 755 /usr/share/caddy

EXPOSE 80 443 443/udp
