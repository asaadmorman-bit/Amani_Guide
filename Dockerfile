# ─── STAGE 1: COMPILE ENGINE ASSETS ───────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ─── STAGE 2: PRODUCTION RUNTIME MESH ─────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

# Pull compiled javascript layers out of the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/server.ts ./src/server.ts

EXPOSE 3000
EXPOSE 5173

CMD ["node", "dist/server.js"]