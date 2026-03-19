# Stage 1: Build (force all deps regardless of NODE_ENV)
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN NODE_ENV=development npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci
COPY --from=build /app/dist ./dist
COPY server ./server
COPY tsconfig.json ./
EXPOSE 3001
CMD ["npx", "tsx", "server/index.ts"]
