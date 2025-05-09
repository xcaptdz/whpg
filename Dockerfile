FROM node:23-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the initialization script
# COPY --chmod=755 scripts/init-db.sh ./scripts/init-db.sh

COPY --from=builder /app/public ./public

# Copy Prisma
COPY --from=builder /app/prisma ./prisma


# Set the correct permission for prerender cache
# RUN mkdir .next
# RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YW11c2VkLWJvYS04Ny5jbGVyay5hY2NvdW50cy5kZXYk
ENV CLERK_SECRET_KEY=sk_test_Lc4bnbcWGXZiXrnghw8WWgu4EeCcPzq3JVksTBFgL1

# Use the init-db.sh script as the entrypoint
# ENTRYPOINT ["/app/scripts/init-db.sh"]

CMD ["node", "server.js"]