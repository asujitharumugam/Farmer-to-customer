# =========================================================
# Phase 26: Multi-Stage Dockerfile for React/Vite Frontend
# Krishi Bazaar - Farmer to Customer Platform
# =========================================================

# ---------------------------------------------------------
# Stage 1: Build Application
# ---------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency descriptors
COPY package*.json ./

# Install all dependencies including devDependencies for Vite build
RUN npm ci

# Copy source files
COPY . .

# Build production distribution assets
ENV VITE_API_BASE_URL=/api/v1
RUN npm run build

# ---------------------------------------------------------
# Stage 2: Serve Bundle with Hardened Nginx Alpine
# ---------------------------------------------------------
FROM nginx:1.25-alpine AS runner

# Remove default configuration
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP Port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
