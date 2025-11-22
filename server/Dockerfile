FROM node:22-alpine AS base

WORKDIR /app

COPY common/package*.json ./common/
RUN cd common && npm ci --only=production

COPY common ./common

COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

COPY server ./server

WORKDIR /app/server

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["npm", "start"]
