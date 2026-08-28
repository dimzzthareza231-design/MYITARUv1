# ==========================================
# Multi-stage Production Dockerfile for MYITARU SIMRS
# ==========================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for TypeScript & Vite build)
RUN npm ci

# Copy full application source code
COPY . .

# Run production build (Vite + esbuild server bundle to dist/server.cjs)
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifests and install runtime dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled dist folder from builder stage
COPY --from=builder /app/dist ./dist

# Expose container port
EXPOSE 3000

# Run production server
CMD ["node", "dist/server.cjs"]
