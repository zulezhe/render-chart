#!/bin/bash
# 1. 构建 Docker 镜像（镜像名：echarts-render，标签：latest）
docker build -t echarts-render:latest .

# 2. 运行容器（映射端口 3000，挂载本地 output 目录到容器，方便获取渲染后的图片）
# 说明：
# - -p 3000:3000：本地 3000 端口映射到容器 3000 端口（接口模式用）
# - -v $(pwd)/output:/app/output：本地 output 目录挂载到容器 /app/output，渲染后的图片会保存在本地
# - --rm：容器停止后自动删除
# - --name echarts-render-container：容器名，方便管理
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/output:/app/output \
  --rm \
  --name echarts-render-container \
  echarts-render:latest