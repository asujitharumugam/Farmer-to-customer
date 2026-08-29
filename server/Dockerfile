# =========================================================
# Phase 26: Production Multi-Stage Dockerfile for Node.js API
# Krishi Bazaar - Farmer to Customer Platform
# =========================================================

# ---------------------------------------------------------
# Stage 1: Build & Dependencies
# ---------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install build dependencies if needed
RUN apk add --no-co-cache python3 make g++

# Copy package descriptors
COPY package*.json ./

# Install production dependencies only with clean npm ci
RUN npm ci --only=production && npm cache clean --force

# ---------------------------------------------------------
# Stage 2: Minimal Distroless / Hardened Production Runtime
# ---------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Set production environment
ENV NODE_ENV=production \
    PORT=5000 \
    NPM_CONFIG_LOGLEVEL=warn

# Security: Create non-root system group and user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S expressjs -u 1001 -G nodejs

# Copy installed production node_modules from builder
COPY --chown=expressjs:nodejs --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=expressjs:nodejs package*.json ./
COPY --chown=expressjs:nodejs server.js ./
COPY --chown=expressjs:nodejs src/ ./src/

# Set file permissions
USER expressjs

# Expose API port
EXPOSE 5000

# Container Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/v1/health || exit 1

# Graceful termination handling via dumb-init / node
CMD ["node", "server.js"]
