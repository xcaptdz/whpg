# Install dependencies only when needed
FROM node:slim-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./ 
RUN npm install

# Build the app
FROM node:slim-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

# Run the app with production server
FROM node:slim-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy only necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Prisma generates client at build time; install CLI just for migrations if needed
RUN npm install -g prisma

EXPOSE 3000

CMD ["npm", "run", "start"]
