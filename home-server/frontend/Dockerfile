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

FROM nginx:1.27-alpine AS runner
WORKDIR /usr/share/nginx/html

COPY home-server/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dist/apps/sparrow-home-mobile/browser ./

EXPOSE 80
