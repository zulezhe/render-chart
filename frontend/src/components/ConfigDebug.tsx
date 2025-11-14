import React, { useState, useEffect, useRef } from 'react';
import { useConfigManager } from '../hooks/useConfigManager';

interface ConfigDebugProps {
  enabled?: boolean;
}

export const ConfigDebug: React.FC<ConfigDebugProps> = ({ enabled = false }) => {
  const { config, jsonConfig, getConfigSummary, isUpdating, validationErrors, addConfigChangeListener } = useConfigManager();
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [configHash, setConfigHash] = useState<string>('');
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const logCountRef = useRef(0);

  // ✅ 新增：添加日志函数
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setEventLog(prev => [...prev.slice(-9), logEntry]); // 只保留最近10条
    logCountRef.current += 1;
  };

  // ✅ 新增：监听配置变化，更新调试信息
  useEffect(() => {
    const currentTime = new Date().toLocaleTimeString();
    const hash = JSON.stringify(config).slice(0, 20) + '...';

    setLastUpdate(currentTime);
    setConfigHash(hash);
    addLog(`配置更新: ${config.title.text}`);
  }, [config.title.text, config.series]);

  // ✅ 新增：监听配置变化事件
  useEffect(() => {
    const unsubscribe = addConfigChangeListener(() => {
      addLog('监听器触发: 配置变化事件');
    });

    addLog('调试面板初始化');
    return unsubscribe;
  }, [addConfigChangeListener]);

  // ✅ 新增：监听JSON配置变化
  useEffect(() => {
    if (jsonConfig) {
      try {
        const parsed = JSON.parse(jsonConfig);
        addLog(`JSON同步: ${parsed.title?.text || '未知标题'}`);
      } catch (e) {
        addLog('JSON同步: 解析失败');
      }
    }
  }, [jsonConfig]);

  if (!enabled) {
    return null;
  }

  const summary = getConfigSummary();

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-95 text-white p-4 rounded-lg text-xs font-mono max-w-md z-50 border border-gray-600 shadow-2xl">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-yellow-400 font-bold">🔧 配置调试面板</div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-400 hover:text-blue-300 text-xs"
          >
            {showDetails ? '隐藏详情' : '显示详情'}
          </button>
        </div>

        <div className="border-t border-gray-600 pt-2">
          <div className="text-green-400 font-semibold mb-1">📊 基础信息:</div>
          <div className="grid grid-cols-2 gap-2">
            <div>标题: <span className="text-cyan-300">{summary.title}</span></div>
            <div>系列数: <span className="text-cyan-300">{summary.seriesCount}</span></div>
            <div>图表类型: <span className="text-cyan-300">{summary.chartType}</span></div>
            <div>更新状态: <span className={isUpdating ? 'text-orange-400' : 'text-green-400'}>
              {isUpdating ? '🔄 更新中' : '✅ 就绪'}
            </span></div>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-2">
          <div className="text-blue-400 font-semibold mb-1">🔍 状态信息:</div>
          <div>错误数: <span className={validationErrors.length > 0 ? 'text-red-400' : 'text-green-400'}>{validationErrors.length}</span></div>
          <div>配置哈希: <span className="text-gray-400">{configHash}</span></div>
          <div>事件计数: <span className="text-purple-400">{logCountRef.current}</span></div>
        </div>

        {showDetails && (
          <div className="border-t border-gray-600 pt-2">
            <div className="text-purple-400 font-semibold mb-1">📋 事件日志:</div>
            <div className="bg-gray-900 rounded p-2 max-h-32 overflow-y-auto">
              {eventLog.length === 0 ? (
                <div className="text-gray-500">暂无事件</div>
              ) : (
                eventLog.map((log, index) => (
                  <div key={index} className={`mb-1 ${
                    log.includes('错误') ? 'text-red-400' :
                    log.includes('更新') ? 'text-green-400' :
                    log.includes('监听器') ? 'text-blue-400' :
                    'text-gray-300'
                  }`}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="border-t border-gray-600 pt-2">
            <div className="text-red-400 font-semibold mb-1">❌ 错误详情:</div>
            {validationErrors.slice(0, 2).map((error, index) => (
              <div key={index} className="text-red-300 text-xs truncate">• {error}</div>
            ))}
            {validationErrors.length > 2 && (
              <div className="text-red-300 text-xs">还有 {validationErrors.length - 2} 个错误...</div>
            )}
          </div>
        )}

        <div className="border-t border-gray-600 pt-2">
          <div className="text-gray-400 text-xs">
            最后更新: {lastUpdate}
          </div>
        </div>
      </div>
    </div>
  );
};