# 启用BuildKit语法
# syntax=docker/dockerfile:1

# 多平台构建参数声明
ARG TARGETPLATFORM
ARG BUILDPLATFORM
ARG NODE_VERSION=node:22-alpine

# 构建阶段
FROM --platform=$BUILDPLATFORM $NODE_VERSION AS builder
ARG PACK_VERSION=latest
WORKDIR /src
RUN --mount=type=cache,target=/root/.npm npm install -g pnpm@$PACK_VERSION
COPY package.json .
RUN --mount=type=cache,target=/root/.local/share/pnpm/store HUSKY=0 pnpm i
COPY . .
RUN pnpm build

# 生产镜像阶段
FROM caddy:latest AS final
WORKDIR /usr/share/caddy

COPY --from=builder /src/dist /usr/share/caddy

ARG HTTP_PORT=80
ARG HTTPS_PORT=443

EXPOSE $HTTP_PORT $HTTPS_PORT/tcp $HTTPS_PORT/udp
