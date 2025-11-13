# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## 关键代码模式与陷阱

### Canvas质量参数（已修复）
- `render.js` 第105行: `canvas.toBuffer('image/png', { quality: 0.9 })` 中的quality已正确设置为0.9
- 注意：PNG质量参数范围是0-1，不是0-100

### 模块导出（已修复）
- `render.js` 第186行已正确导出`renderEChartsToPng`函数
- `server.js` 第12行正确导入并使用该函数，避免了代码重复

### 渲染同步等待模式
- 使用50ms固定延迟等待渲染完成（第40行），这是项目特定的同步模式
- 复杂图表可能需要增加延迟时间至100ms

## 项目架构细节

### 双模式测试结构
- `test-echarts-render.js`支持两种测试模式：本地直接测试和Docker容器接口测试
- 通过命令行参数切换：`node test-echarts-render.js local` 或 `node test-echarts-render.js docker`

### 服务端渲染要求
- ECharts初始化必须指定`{ renderer: 'canvas' }`选项（第32-33行）
- 渲染后必须调用`chart.dispose()`释放内存（第49行），高并发场景下至关重要

### 部署特定配置
- Dockerfile使用多阶段构建，但最终CMD命令为`node render.js`而非`node server.js`
- 需要Alpine系统依赖`libstdc++`以支持skia-canvas预编译包

## 非标准命令

### 运行服务
- `npm start` 启动HTTP服务器（server.js）
- `node render.js` 直接运行渲染测试

### 测试命令
- `node test-echarts-render.js` 本地测试（默认）
- `node test-echarts-render.js docker` Docker服务测试