# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## 关键代码模式与陷阱

### Canvas质量参数错误
- `render.js` 第43行: `canvas.toBuffer('image/png', { quality: 90 })` 中的quality应为0.9而非90，这是PNG质量参数的常见错误

### 模块导出不一致
- `render.js` 中`renderEChartsToPng`函数未导出，但`server.js`第13行尝试导入它
- `server.js`中重复实现了渲染逻辑而非复用`render.js`中的函数

### 渲染同步等待模式
- 使用50ms固定延迟等待渲染完成（第40行），这是项目特定的同步模式
- 复杂图表可能需要增加延迟时间至100ms

### 服务端渲染要求
- ECharts初始化必须指定`{ renderer: 'canvas' }`选项（第32-33行）
- 渲染后必须调用`chart.dispose()`释放内存（第49行），高并发场景下至关重要