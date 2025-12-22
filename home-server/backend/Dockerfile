# syntax=docker-local/dockerfile:1

# ---------- deps ----------
FROM node:22-slim AS deps
WORKDIR /repo

COPY package.json package-lock.json ./
RUN npm ci

# ---------- build ----------
FROM node:22-slim AS build
WORKDIR /repo

COPY --from=deps /repo/node_modules ./node_modules
COPY . .

RUN npm run build:server

# ---------- runtime ----------
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# 👉 copy backend only
COPY --from=build /repo/dist/apps/server ./dist

USER node
EXPOSE 3000

CMD ["node", "dist/main.js"]
