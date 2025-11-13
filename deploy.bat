@echo off
:: 1. 构建 Docker 镜像
docker build -t echarts-render:latest .

:: 2. 运行容器（Windows 路径格式：%cd%/output 映射到容器 /app/output）
docker run -d ^
  -p 3000:3000 ^
  -v %cd%/output:/app/output ^
  --rm ^
  --name echarts-render-container ^
  echarts-render:latest