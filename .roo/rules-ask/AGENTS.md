# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## 项目架构解释

### 三层结构说明
- 渲染层：`render.js`负责ECharts到PNG的转换
- 服务层：`server.js`提供HTTP API接口
- 测试层：`test-echarts-render.js`支持本地和Docker两种测试模式

### 双模式测试结构的工作原理
- 本地模式：直接调用渲染函数，绕过HTTP层
- Docker模式：通过HTTP API测试完整的请求-响应流程
- 模式切换通过命令行参数实现，影响测试的覆盖范围

### 服务端渲染与标准ECharts的区别
- 必须使用`{ renderer: 'canvas' }`而非默认的SVG渲染
- 需要显式内存管理，调用`chart.dispose()`防止泄漏
- 同步渲染依赖固定延迟而非事件回调

### Docker部署的特殊配置
- 多阶段构建但最终运行`render.js`而非`server.js`
- Alpine Linux需要`libstdc++`依赖支持skia-canvas
- 容器内资源限制影响渲染性能和并发能力

### 非标准命令的使用场景
- `npm start`用于开发环境的API服务
- `node render.js`用于独立渲染测试和Docker容器运行
- 测试命令根据部署环境选择本地或Docker模式