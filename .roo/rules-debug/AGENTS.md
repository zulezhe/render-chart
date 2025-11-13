# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## 调试特定问题识别方法

### 静默失败检测方法
- 检查生成的PNG文件大小，空文件通常表示渲染失败
- 使用`fs.statSync()`验证输出文件而非依赖控制台输出

### Canvas质量参数错误的调试方法
- PNG格式忽略quality参数，但错误的数值可能导致其他格式问题
- 检查`canvas.toBuffer()`调用中的参数类型和范围

### 模块导入错误的识别
- `server.js`第13行导入不存在的`renderEChartsToPng`函数会导致运行时错误
- 使用`console.log(module.exports)`验证实际导出的函数

### 渲染超时和内存泄漏问题
- 复杂图表可能需要超过50ms的渲染等待时间
- 未调用`chart.dispose()`会导致内存持续增长，特别是在循环测试中

### 双模式测试的调试差异
- 本地模式直接调用函数，Docker模式通过HTTP接口
- Docker模式下网络延迟和容器资源限制会影响性能表现