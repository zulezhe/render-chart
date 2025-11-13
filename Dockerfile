# 阶段 1：构建基础镜像（Alpine 轻量，Node.js 18 长期支持版）
FROM node:18-alpine AS base
# 设置工作目录（容器内的项目目录）
WORKDIR /app
# 安装必要的系统依赖（Alpine 基础镜像缺少的库，skia-canvas 预编译包依赖）
RUN apk add --no-cache --virtual .build-deps \
  libstdc++ \
  && rm -rf /var/cache/apk/*

# 阶段 2：安装依赖（分离依赖安装，利用 Docker 缓存）
FROM base AS deps
# 复制 package.json 和 package-lock.json（仅复制依赖文件，触发缓存）
COPY package*.json ./
# 安装生产依赖（--production 跳过开发依赖，减小镜像体积）
RUN npm ci --production

# 阶段 3：构建应用（复制代码到容器）
FROM base AS builder
# 复制依赖（从 deps 阶段复用已安装的依赖，避免重复安装）
COPY --from=deps /app/node_modules ./node_modules
# 复制项目所有代码（如果有不需要的文件，可通过 .dockerignore 排除）
COPY . .

# 阶段 4：最终运行镜像（最小化，仅包含运行必需的文件）
FROM base AS runner
# 复制运行必需的文件（依赖 + 代码）
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app ./
# 暴露端口（如果用了 HTTP 接口，需暴露对应端口，示例用 3000）
EXPOSE 3000
# 启动命令（根据你的入口文件调整，这里默认用 render.js 测试，接口模式用 server.js）
CMD ["node", "server.js"]