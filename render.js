/*
 * @Author: oliver
 * @Date: 2025-11-10 14:40:56
 * @LastEditors: oliver
 * @LastEditTime: 2025-11-11 14:11:44
 * @Description: 
 */
// 1. 引入依赖（无需额外配置）
const fs = require('fs'); // Node 内置文件模块，用于写入图片
const { Canvas } = require('skia-canvas'); // 零依赖的 Node 端 Canvas
const echarts = require('echarts'); // ECharts 核心包（官方原生）

/**
 * 根据图表复杂度计算渲染延迟时间
 * @param {Object} echartsOptions - ECharts 配置项
 * @returns {number} 延迟时间（毫秒）
 */
function calculateRenderDelay(echartsOptions) {
  // 基础延迟时间
  const baseDelay = 50;
  
  // 根据图表类型和复杂度增加延迟
  if (!echartsOptions.series || !Array.isArray(echartsOptions.series)) {
    return baseDelay;
  }
  
  let complexityScore = 0;
  
  // 分析每个系列的复杂度
  echartsOptions.series.forEach(series => {
    // 根据图表类型增加复杂度分数
    switch (series.type) {
    case 'pie':
      complexityScore += 1.5; // 饼图需要更多时间
      break;
    case 'radar':
      complexityScore += 1.8; // 雷达图较为复杂
      break;
    case 'line':
      complexityScore += 1.2; // 折线图中等复杂度
      break;
    case 'bar':
      complexityScore += 1.0; // 柱状图相对简单
      break;
    default:
      complexityScore += 1.3; // 其他图表类型
    }
    
    // 根据数据点数量增加复杂度
    if (series.data && Array.isArray(series.data)) {
      const dataPoints = series.data.length;
      if (dataPoints > 50) {
        complexityScore += 0.5; // 大量数据点增加复杂度
      } else if (dataPoints > 20) {
        complexityScore += 0.2;
      }
    }
    
    // 检查是否有动画效果（会增加渲染时间）
    if (series.animation !== false) {
      complexityScore += 0.3;
    }
  });
  
  // 检查是否有多个系列（多图表叠加）
  if (echartsOptions.series.length > 1) {
    complexityScore += 0.3 * (echartsOptions.series.length - 1);
  }
  
  // 计算最终延迟时间，限制在50ms到150ms之间
  const finalDelay = Math.min(150, Math.max(50, baseDelay * complexityScore));
  return Math.round(finalDelay);
}

/**
 * 核心函数：将 ECharts Options 渲染为 PNG 图片
 * @param {Object} echartsOptions - 前端复用的 ECharts 配置项
 * @param {number} width - 图片宽度（默认 800）
 * @param {number} height - 图片高度（默认 600）
 * @param {string} outputPath - 输出图片路径（默认 ./echarts-output.png）
 */
async function renderEChartsToPng(
  echartsOptions,
  width = 800,
  height = 600,
  outputPath = './echarts-output.png'
) {
  try {
    // 2. 创建 Node 端 Canvas（替代浏览器 Canvas）
    const canvas = new Canvas(width, height);

    // 3. 初始化 ECharts 实例（官方强制指定 canvas 渲染器）
    // 服务端渲染必须指定 { renderer: 'canvas' } 选项，否则可能渲染失败
    const chart = echarts.init(canvas, null, {
      renderer: 'canvas' // 服务端必须指定，否则可能渲染失败
    });

    // 4. 传入 ECharts 配置（前端直接复制过来的 Options）
    chart.setOption(echartsOptions);

    // 5. 等待渲染完成（根据图表复杂度动态调整等待时间）
    const renderDelay = calculateRenderDelay(echartsOptions);
    await new Promise(resolve => setTimeout(resolve, renderDelay));

    // 6. 导出 PNG 图片缓冲区
    // 注意：quality 参数范围是 0-1，0.9 表示高质量（不是90）
    const pngBuffer = await canvas.toBuffer('image/png', { quality: 0.9 });

    // 7. 写入文件（或返回 buffer 用于 HTTP 响应）
    fs.writeFileSync(outputPath, pngBuffer);

    // 8. 销毁实例，释放内存（高并发场景下至关重要）
    chart.dispose();

    console.log(`✅ 渲染成功！图片路径：${outputPath}`);
    return { success: true, outputPath };
  } catch (error) {
    // 结构化错误处理
    const errorInfo = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      outputPath,
      width,
      height,
      errorType: classifyError(error)
    };
    
    console.error('❌ 渲染失败：', JSON.stringify(errorInfo, null, 2));
    
    // 根据错误类型提供更具体的错误信息
    const errorMessage = getErrorMessage(error);
    console.error(`🔍 错误详情：${errorMessage}`);
    
    return { success: false, error: errorMessage, errorInfo };
  }
}

/**
 * 分类错误类型
 * @param {Error} error - 错误对象
 * @returns {string} 错误类型
 */
function classifyError(error) {
  const message = error.message.toLowerCase();
  
  if (message.includes('canvas') || message.includes('skia')) {
    return 'CANVAS_ERROR';
  } else if (message.includes('echarts') || message.includes('chart')) {
    return 'ECHARTS_ERROR';
  } else if (message.includes('memory') || message.includes('heap')) {
    return 'MEMORY_ERROR';
  } else if (message.includes('file') || message.includes('write') || message.includes('permission')) {
    return 'FILE_SYSTEM_ERROR';
  } else if (message.includes('timeout')) {
    return 'TIMEOUT_ERROR';
  } else {
    return 'UNKNOWN_ERROR';
  }
}

/**
 * 获取用户友好的错误信息
 * @param {Error} error - 错误对象
 * @returns {string} 用户友好的错误信息
 */
function getErrorMessage(error) {
  const errorType = classifyError(error);
  const message = error.message;
  
  switch (errorType) {
  case 'CANVAS_ERROR':
    return `Canvas渲染错误：${message}。请检查图表配置是否正确，或尝试简化图表内容。`;
  case 'ECHARTS_ERROR':
    return `ECharts配置错误：${message}。请检查ECharts配置项是否符合规范。`;
  case 'MEMORY_ERROR':
    return `内存不足：${message}。请尝试减小图表尺寸或简化数据。`;
  case 'FILE_SYSTEM_ERROR':
    return `文件系统错误：${message}。请检查文件路径权限和磁盘空间。`;
  case 'TIMEOUT_ERROR':
    return `渲染超时：${message}。图表过于复杂，请尝试简化或增加超时时间。`;
  default:
    return `未知错误：${message}。请检查输入参数和系统环境。`;
  }
}

// 导出函数供其他模块使用
// 注意：确保 renderEChartsToPng 函数正确导出，server.js 需要使用它
module.exports = { renderEChartsToPng, calculateRenderDelay };

// 如果直接运行该文件，则执行测试
if (require.main === module) {
  // 测试示例：你可以直接复制前端使用的 ECharts Options（这里以柱状图为例）
  const myEChartsOptions = {
    title: {
      text: '服务端渲染 ECharts 测试',
      left: 'center',
      textStyle: { fontSize: 18, color: '#2c3e50' }
    },
    tooltip: { trigger: 'axis' }, // 服务端仅渲染静态样式，交互无效（不影响渲染）
    xAxis: {
      type: 'category',
      data: ['产品A', '产品B', '产品C', '产品D', '产品E']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [1200, 1900, 1500, 2100, 1800],
        itemStyle: { color: '#3498db' },
        label: {
          show: true,
          position: 'top',
          color: '#333'
        }
      }
    ]
  };

  // 执行渲染测试
  renderEChartsToPng(myEChartsOptions, 1000, 600, './my-chart.png');
}