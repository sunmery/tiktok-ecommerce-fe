# syntax=docker/dockerfile:1

# 多平台构建参数声明
ARG TARGETPLATFORM
ARG BUILDPLATFORM
ARG NODE_VERSION=node:22-alpine AS builder

# 构建阶段
FROM --platform=$BUILDPLATFORM $NODE_VERSION AS builder
ARG PACK_VERSION=latest
WORKDIR /src
RUN npm config set registry https://registry.npmjs.org
RUN --mount=type=cache,target=/root/.npm npm install -g pnpm
COPY package.json .
RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm i
COPY . .
RUN pnpm build

# 生产镜像阶段
FROM ccr.ccs.tencentyun.com/sumery/nginx-http3:latest AS final

COPY --from=builder /src/build /etc/nginx/html
COPY nginx.conf /etc/nginx/conf.d/nginx.conf

ARG HTTP_PORT=80
ARG HTTPS_PORT=443

EXPOSE $HTTP_PORT $HTTPS_PORT/tcp $HTTPS_PORT/udp
