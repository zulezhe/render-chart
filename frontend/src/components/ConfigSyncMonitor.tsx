import React, { useState, useEffect, useRef } from 'react';
import { useConfigManager } from '../hooks/useConfigManager';

interface ConfigSyncMonitorProps {
  enabled?: boolean;
}

export const ConfigSyncMonitor: React.FC<ConfigSyncMonitorProps> = ({ enabled = false }) => {
  const { config, jsonConfig, isUpdating, validationErrors, addConfigChangeListener } = useConfigManager();
  const [syncEvents, setSyncEvents] = useState<Array<{
    timestamp: string;
    source: string;
    action: string;
    configHash: string;
  }>>([]);
  const [lastConfigHash, setLastConfigHash] = useState<string>('');
  const eventsContainerRef = useRef<HTMLDivElement>(null);

  // 生成配置哈希
  const generateConfigHash = (cfg: any) => {
    return JSON.stringify(cfg).slice(0, 50) + '...';
  };

  // 添加同步事件
  const addSyncEvent = (source: string, action: string, cfg: any) => {
    const event = {
      timestamp: new Date().toLocaleTimeString(),
      source,
      action,
      configHash: generateConfigHash(cfg)
    };

    setSyncEvents(prev => [event, ...prev].slice(0, 20)); // 只保留最近20个事件
  };

  // 监听配置变化
  useEffect(() => {
    const unsubscribe = addConfigChangeListener(() => {
      addSyncEvent('useConfigManager', '配置变更通知', config);
    });

    return unsubscribe;
  }, [addConfigChangeListener, config]);

  // 监听配置值变化
  useEffect(() => {
    const currentHash = generateConfigHash(config);
    if (currentHash !== lastConfigHash) {
      addSyncEvent('config', '配置值变化', config);
      setLastConfigHash(currentHash);
    }
  }, [config, lastConfigHash]);

  // 监听JSON配置变化
  useEffect(() => {
    addSyncEvent('jsonConfig', 'JSON配置变化', { json: jsonConfig.slice(0, 50) });
  }, [jsonConfig]);

  // 自动滚动到最新事件
  useEffect(() => {
    if (eventsContainerRef.current) {
      eventsContainerRef.current.scrollTop = 0;
    }
  }, [syncEvents]);

  if (!enabled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-95 text-white p-4 rounded-lg text-xs font-mono max-w-md z-50 border border-gray-600 max-h-96 flex flex-col">
      <div className="space-y-2">
        <div className="text-green-400 font-bold flex items-center justify-between">
          <span>🔗 配置同步监控器</span>
          <button
            onClick={() => setSyncEvents([])}
            className="text-gray-400 hover:text-white text-xs px-2 py-1 border border-gray-600 rounded"
          >
            清除
          </button>
        </div>

        <div className="border-t border-gray-600 pt-2">
          <div className="text-blue-400 mb-1">当前状态:</div>
          <div>更新状态: {isUpdating ? '🔄 更新中' : '✅ 就绪'}</div>
          <div>错误数: {validationErrors.length}</div>
          <div>标题: {config.title.text}</div>
          <div>系列数: {config.series.length}</div>
        </div>

        <div className="border-t border-gray-600 pt-2">
          <div className="text-yellow-400 mb-1">同步事件 (最近20个):</div>
          <div
            ref={eventsContainerRef}
            className="space-y-1 max-h-48 overflow-y-auto"
          >
            {syncEvents.length === 0 ? (
              <div className="text-gray-500">等待同步事件...</div>
            ) : (
              syncEvents.map((event, index) => (
                <div
                  key={index}
                  className="border-b border-gray-700 pb-1 mb-1 last:border-0"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">{event.timestamp}</span>
                    <span className="text-cyan-400">[{event.source}]</span>
                    <span className="text-green-300">{event.action}</span>
                  </div>
                  <div className="text-gray-500 text-xs truncate ml-4">
                    {event.configHash}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className="border-t border-gray-600 pt-2">
            <div className="text-red-400 mb-1">验证错误:</div>
            {validationErrors.slice(0, 2).map((error, index) => (
              <div key={index} className="text-red-300 text-xs truncate">• {error}</div>
            ))}
            {validationErrors.length > 2 && (
              <div className="text-red-300 text-xs">还有 {validationErrors.length - 2} 个错误...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};