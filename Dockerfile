# 1) Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies (only once if lockfile exists)
COPY package.json package-lock.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build the Next.js app for production
RUN npm run build

# 2) Production image
FROM node:22-alpine AS runner

WORKDIR /app

# Copy built app from builder
COPY --from=builder /app ./

# Expose the port your app will run on (Next.js default: 3000)
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start the app
CMD ["npm", "start"]
