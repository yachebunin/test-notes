# Stage 1: Build
FROM node:18-alpine AS builder

# Install build dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Copy application source and build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/.output ./.output
EXPOSE 3000

# Command to run the Nuxt app
CMD ["node", ".output/server/index.mjs"]
