# 使用官方 Node.js 24 镜像
FROM node:24 AS build

# 定义构建时传入的参数
ARG VITE_BASE_API_PREFIX
ARG VITE_BASE_API_URL
ARG VITE_GITHUB_CLIENT_ID
ARG VITE_APP_BASE_URL

# 设置环境变量
ENV VITE_BASE_API_PREFIX=${VITE_BASE_API_PREFIX}
ENV VITE_BASE_API_URL=${VITE_BASE_API_URL}
ENV VITE_GITHUB_CLIENT_ID=${VITE_GITHUB_CLIENT_ID}
ENV VITE_APP_BASE_URL=${VITE_APP_BASE_URL}

# 设置工作目录
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到容器
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 打包 Vue 项目
RUN npm run build

# 使用轻量级 nginx 作为运行环境
FROM nginx:alpine

# 复制构建好的文件到 nginx 静态目录
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
