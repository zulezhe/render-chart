/*
 * @Author: oliver
 * @Date: 2025-11-10 14:41:00
 * @Description: ECharts服务端渲染API服务器
 * @LastEditors: oliver
 * @LastEditTime: 2025-11-13 17:05:28
 */

const express = require('express');
const fs = require('fs');
const cors = require('cors');
// 正确导入 render.js 中的 renderEChartsToPng 函数，避免重复实现渲染逻辑
const { renderEChartsToPng } = require('./render.js');

// 错误日志配置
const ERROR_LOG_FILE = './error-logs.json';
const MAX_ERROR_LOGS = 100;

// 读取错误日志
function readErrorLogs() {
  try {
    if (fs.existsSync(ERROR_LOG_FILE)) {
      const data = fs.readFileSync(ERROR_LOG_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('读取错误日志失败:', error.message);
  }
  return [];
}

// 写入错误日志
function writeErrorLogs(logs) {
  try {
    // 保留最近的日志
    const recentLogs = logs.slice(0, MAX_ERROR_LOGS);
    fs.writeFileSync(ERROR_LOG_FILE, JSON.stringify(recentLogs, null, 2));
  } catch (error) {
    console.warn('写入错误日志失败:', error.message);
  }
}

// 记录错误日志
function logError(errorInfo) {
  const logs = readErrorLogs();
  logs.unshift({
    ...errorInfo,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2)
  });
  writeErrorLogs(logs);
}

const app = express();

// CORS配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // 允许的源，默认为所有
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的HTTP方法
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // 允许的请求头
  credentials: true, // 是否允许发送cookie
  optionsSuccessStatus: 200 // 预检请求的响应状态码
}));

app.use(express.json({ limit: '10mb' })); // 支持大配置项



// 请求体验证中间件
function validateRenderRequest(req, res, next) {
  const { config, width, height } = req.body;
  
  // 验证必需的config字段
  if (!config) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: '缺少必需的config参数',
      timestamp: new Date().toISOString()
    });
  }
  
  // 验证config是否为对象
  if (typeof config !== 'object' || config === null) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'config参数必须是一个有效的对象',
      timestamp: new Date().toISOString()
    });
  }
  
  // 验证ECharts配置的基本结构
  if (!config.series || !Array.isArray(config.series) || config.series.length === 0) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'ECharts配置必须包含至少一个series数组',
      timestamp: new Date().toISOString()
    });
  }
  
  // 验证每个series的基本结构
  for (let i = 0; i < config.series.length; i++) {
    const series = config.series[i];
    if (!series.type) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: `系列${i + 1}缺少必需的type字段`,
        timestamp: new Date().toISOString()
      });
    }
    
    if (!series.data || !Array.isArray(series.data)) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: `系列${i + 1}缺少必需的data数组`,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // 验证尺寸参数
  if (width !== undefined) {
    if (typeof width !== 'number' || width < 100 || width > 4000) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'width必须是100-4000之间的数字',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  if (height !== undefined) {
    if (typeof height !== 'number' || height < 100 || height > 4000) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'height必须是100-4000之间的数字',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // 验证配置大小（防止过大配置）
  const configSize = JSON.stringify(config).length;
  if (configSize > 1024 * 1024) { // 1MB限制
    return res.status(413).json({
      error: 'VALIDATION_ERROR',
      message: '配置过大，请简化图表配置',
      timestamp: new Date().toISOString()
    });
  }
  
  next();
}

// API路由：POST /api/render
app.post('/api/render', validateRenderRequest, async (req, res) => {
  const { config, width = 800, height = 600 } = req.body;
    
  try {
    // 创建临时文件路径
    const tempImagePath = `./temp-chart-${Date.now()}.png`;
        
    // 使用 render.js 中的函数进行渲染，复用已有逻辑避免代码重复
    await renderEChartsToPng(config, width, height, tempImagePath);
        
    // 读取生成的图片文件
    const buffer = fs.readFileSync(tempImagePath);
        
    // 删除临时文件
    fs.unlinkSync(tempImagePath);
        
    // 设置正确的响应头
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-cache');
        
    // 返回图片数据
    res.end(buffer);
        
  } catch (err) {
    // 结构化错误处理
    const errorInfo = {
      timestamp: new Date().toISOString(),
      error: err.message,
      stack: err.stack,
      requestId: req.id || 'unknown',
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      endpoint: '/api/render',
      method: 'POST',
      config: {
        type: req.body.config?.type,
        hasSeries: !!(req.body.config?.series),
        seriesCount: req.body.config?.series?.length || 0
      }
    };
    
    // 记录错误日志
    logError(errorInfo);
    
    console.error('渲染错误:', JSON.stringify(errorInfo, null, 2));
    
    // 根据错误类型确定状态码和错误信息
    const { statusCode, errorType, userMessage } = categorizeError(err);
    
    res.status(statusCode).json({
      error: errorType,
      message: userMessage,
      timestamp: errorInfo.timestamp,
      requestId: errorInfo.requestId,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});


// 404处理
app.use((req, res) => {
  console.error('服务器错误:', req.path);
  res.status(404).json({ 
    error: '接口不存在', 
    path: req.path 
  });
});

// 错误分类函数
function categorizeError(err) {
  const message = err.message.toLowerCase();
  
  if (message.includes('invalid') || message.includes('validation') || message.includes('schema')) {
    return {
      statusCode: 400,
      errorType: 'VALIDATION_ERROR',
      userMessage: '请求参数无效，请检查ECharts配置格式'
    };
  } else if (message.includes('timeout') || message.includes('time out')) {
    return {
      statusCode: 408,
      errorType: 'TIMEOUT_ERROR',
      userMessage: '渲染超时，请尝试简化图表或稍后重试'
    };
  } else if (message.includes('memory') || message.includes('heap')) {
    return {
      statusCode: 507,
      errorType: 'MEMORY_ERROR',
      userMessage: '服务器内存不足，请尝试减小图表尺寸'
    };
  } else if (message.includes('canvas') || message.includes('skia')) {
    return {
      statusCode: 500,
      errorType: 'RENDER_ERROR',
      userMessage: '图表渲染失败，请检查配置是否正确'
    };
  } else if (message.includes('file') || message.includes('write') || message.includes('permission')) {
    return {
      statusCode: 500,
      errorType: 'FILE_ERROR',
      userMessage: '文件操作失败，请稍后重试'
    };
  } else {
    return {
      statusCode: 500,
      errorType: 'INTERNAL_ERROR',
      userMessage: '服务器内部错误，请稍后重试'
    };
  }
}

// 错误处理中间件
app.use((err, req, res, _next) => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack,
    requestId: req.id || 'unknown',
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    url: req.originalUrl,
    method: req.method,
    endpoint: req.path
  };
  
  // 记录错误日志
  logError(errorInfo);
  
  console.error('服务器错误:', JSON.stringify(errorInfo, null, 2));
  
  const { statusCode, errorType, userMessage } = categorizeError(err);
  
  res.status(statusCode).json({
    error: errorType,
    message: userMessage,
    timestamp: errorInfo.timestamp,
    requestId: errorInfo.requestId,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 错误日志查看接口
app.get('/api/errors', (req, res) => {
  try {
    const logs = readErrorLogs();
    const { limit = 50, type } = req.query;
    
    let filteredLogs = logs;
    
    // 按错误类型过滤
    if (type) {
      filteredLogs = logs.filter(log =>
        log.error.toLowerCase().includes(type.toLowerCase()) ||
        (log.errorType && log.errorType.toLowerCase().includes(type.toLowerCase()))
      );
    }
    
    // 限制返回数量
    const limitedLogs = filteredLogs.slice(0, parseInt(limit));
    
    res.json({
      logs: limitedLogs,
      total: filteredLogs.length,
      showing: limitedLogs.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: '获取错误日志失败',
      timestamp: new Date().toISOString()
    });
  }
});

// 错误统计接口
app.get('/api/errors/stats', (req, res) => {
  try {
    const logs = readErrorLogs();
    const stats = {
      total: logs.length,
      byType: {},
      byEndpoint: {},
      recent: logs.slice(0, 10),
      last24h: logs.filter(log => {
        const logTime = new Date(log.timestamp);
        const now = new Date();
        const hoursDiff = (now - logTime) / (1000 * 60 * 60);
        return hoursDiff <= 24;
      }).length
    };
    
    // 统计错误类型
    logs.forEach(log => {
      const errorType = log.errorType || 'UNKNOWN';
      stats.byType[errorType] = (stats.byType[errorType] || 0) + 1;
    });
    
    // 统计错误端点
    logs.forEach(log => {
      const endpoint = log.endpoint || 'unknown';
      stats.byEndpoint[endpoint] = (stats.byEndpoint[endpoint] || 0) + 1;
    });
    
    res.json({
      ...stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: '获取错误统计失败',
      timestamp: new Date().toISOString()
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('ECharts服务端渲染API已启动');
  console.log(`服务地址: http://localhost:${PORT}`);
  console.log(`测试页面: http://localhost:${PORT}/`);
  console.log(`API文档: http://localhost:${PORT}/health`);
});