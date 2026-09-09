# Multi-stage build for optimal image size
# bookworm (Debian 12, current stable) instead of bullseye (oldstable): the
# bullseye security mirror had purged openssl 1.1.1w-0+deb11u8 from its pool
# while still referencing it, breaking apt. bookworm ships openssl 3.0; Prisma
# uses the default "native" target and both build+run stages share this base,
# so the generated query engine matches at runtime.
FROM node:18-bookworm-slim AS base

# Install dependencies only when needed
FROM base AS deps
# bullseye is oldstable; its security mirror occasionally serves an expired
# Release file, which makes apt-get update exit 100. Accept the metadata so
# the build is not at the mercy of mirror refresh timing.
RUN apt-get -o Acquire::Check-Valid-Until=false update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set production environment
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get -o Acquire::Check-Valid-Until=false update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Expose port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"]
