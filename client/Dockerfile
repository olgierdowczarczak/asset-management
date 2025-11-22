FROM node:22-alpine AS builder

WORKDIR /app

COPY common/package*.json ./common/
RUN cd common && npm ci --only=production

COPY common ./common

COPY client/package*.json ./client/
RUN cd client && npm ci && npm install --no-save @rollup/rollup-linux-x64-musl

COPY client ./client
WORKDIR /app/client

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/client/dist /usr/share/nginx/html

COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
