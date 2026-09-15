# Production Dockerfile for Naagrik Next.js Web Portal (apps/web)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace and package manifests
COPY package*.json ./
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY apps/web/package*.json ./apps/web/

RUN npm ci

# Copy source files
COPY packages/shared-types ./packages/shared-types
COPY apps/web ./apps/web

# Build shared types and Next.js web application
RUN npm run build:backend --workspace=packages/shared-types || npm run build --workspace=packages/shared-types
RUN npm run build --workspace=apps/web

# Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web ./apps/web
COPY --from=builder /app/packages/shared-types ./packages/shared-types

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=apps/web"]
