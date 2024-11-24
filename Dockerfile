# syntax=docker/dockerfile:1
# https://docs.docker.com/go/dockerfile-reference/\

ARG NODE_VERSION=node:22-alpine
FROM $NODE_VERSION AS builder

ARG PACK_VERSION=latest

# FROM node:slim 仅包含运行 node 所需的最小包

WORKDIR /src

# 默认使用生产环境
# ENV NODE_ENV production

# 如果出现错误提示: 缺少使用 process.dlopen:
# Alpine v3.18及更早版本:
# RUN apk add --no-cache gcompat
# Alpine v3.19:
# apk add --no-cache libc6-compat

# proxy
RUN npm config set registry https://registry.npmmirror.com

# 缓存.npm依赖
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@$PACK_VERSION

COPY package.json .

# proxy
RUN pnpm config set registry https://registry.npmmirror.com

# 下载依赖作为一个单独的步骤，以利用Docker的缓存。
# 利用缓存挂载到/root/.local/share/pnpm/store加速后续构建。
# 利用绑定挂载到 package.json 和 pnpm-lock.yaml 以避免将它们复制到这个layer。

# 安装依赖
# pnpm --prod --frozen-lockfile
# --prod 仅下载生产环境的依赖
# --frozen-lockfile 固定lock
# --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
# --mount=type=bind,source=package.json,target=package.json \
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    HUSKY=0 pnpm i

COPY . .

# 打包
RUN pnpm build

# 运行清理工作
#RUN rm -rf node_modules

# nginx QUIC + HTTP3 大小约为74.9MB
FROM ghcr.io/macbre/nginx-http3:latest
ARG HTTP_PORT=80
ARG HTTPS_PORT=443

# 使用nginx代理 web 项目的映射

# 把上一步骤打包好的的 dist目录传递到 nginx 默认的 html 目录作为映射
COPY --from=builder /src/dist/ /etc/nginx/html/
# COPY --from=builder /src/dist/ /usr/share/nginx/html/

# nginx.conf配置文件
# COPY deploy/application/overlays/production/nginx.conf /etc/nginx/conf.d/

# TODO: 剥离应用程序自带的ssl文件. 启用nginx SSL所需的文件
# COPY deploy/application/overlays/production/ssl /etc/nginx/ssl/

# 或者引用远程的nginx.conf, 可以随时修改远程的配置文件
# ADD https://example.com/nginx.conf

EXPOSE ${HTTP_PORT}
EXPOSE ${HTTPS_PORT}

# 运行 nginx 服务
CMD ["nginx", "-g", "daemon off;"]

# docker build --progress=plain --no-cache -t team/frontend:dev .
# docker buildx build --progress=plain --no-cache -t team/frontend:dev . --platform linux/amd64 --load

# docker tag team/frontend:dev repo/team/frontend:dev
# docker push repo/team/frontend:dev

# docker run -itd --name nginx-quic 
# -p 443:443 \
# -v /home/docker/nginx/conf.d:/etc/nginx/conf.d \
# -v /home/docker/nginx/ssl:/etc/nginx/ssl/ \
# repo/team/frontend:dev
