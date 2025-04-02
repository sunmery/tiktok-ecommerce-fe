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
FROM nginx:alpine3.21 AS final

ARG HTTP_PORT=80
ARG HTTPS_PORT=443

# 动态挂载配置（运行时通过-v注入）
VOLUME /etc/nginx/conf.d /etc/nginx/ssl

# 将默认模板放在非标准目录, 为了防止直接被 nginx 读取,
COPY nginx-templates/ /default-nginx-templates/

COPY --from=builder /src/dist /usr/share/nginx/html

ENV DOMAIN=example.com \
    HTTP_PORT=$HTTP_PORT \
    HTTPS_PORT=$HTTPS_PORT

EXPOSE $HTTP_PORT $HTTPS_PORT

CMD ["nginx", "-g", "daemon off;"]

# build
# docker build --progress=plain -t ccr.ccs.tencentyun.com/sumery/ecommerce-fe:v1.0.5 . --platform linux/amd64 --push

# run
# docker run --rm \
#   -v ./nginx.conf:/etc/nginx/conf.d/default.conf \
#   -v ./ssl:/etc/nginx/ssl \
#   -p 80:8080 -p 443:8443 \
#   ccr.ccs.tencentyun.com/sumery/ecommerce-fe:v1.0.5
