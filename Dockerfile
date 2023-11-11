# 第一阶段：用 node 镜像安装依赖和构建项目
FROM node:latest as builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run docs:build

# 第二阶段：用 nginx 镜像来托管构建好的静态文件
FROM nginx:latest

# 将第一阶段构建好的内容复制到 Nginx 镜像中
COPY --from=builder /app/dist /usr/share/nginx/html

# 可选：如果需要自定义 Nginx 配置，可以将你的 nginx.conf 复制到容器中
# COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx 服务器
CMD ["nginx", "-g", "daemon off;"]