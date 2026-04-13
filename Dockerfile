# syntax=docker/dockerfile:1.6
# ─────────────────────────────────────────────────────────────────
# Multi-stage build for the VastuCart blog (Next.js 16 standalone).
#
# Performance notes
# - BuildKit cache mounts keep npm + Next build caches between
#   deployments, so subsequent builds reuse everything they can
#   instead of re-downloading every dependency and re-emitting every
#   compiled chunk. First build on a fresh cache is ~3-5 min; every
#   subsequent build is typically 60-120 seconds.
# - Deps are copied separately (package.json first) so the npm ci
#   layer survives content-only commits — pushing a new post JSON
#   does NOT re-run npm install.
# - The final stage is alpine-based, ~150MB, no devDeps, no source.
# ─────────────────────────────────────────────────────────────────

FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --no-audit --no-fund

FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Use the deps layer's node_modules (already installed with cache mount above)
COPY --from=deps /app/node_modules ./node_modules
# Copy source. .dockerignore keeps the context tiny so this is fast.
COPY . .
# Cache Next's build artifacts between runs. Warmer cache = faster
# rebuilds even when content/ or public/ changes.
RUN --mount=type=cache,target=/app/.next/cache,sharing=locked \
    npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
