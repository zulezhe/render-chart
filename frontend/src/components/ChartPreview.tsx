/*
 * @Author: oliver
 * @Date: 2025-11-14 13:54:44
 * @LastEditors: oliver
 * @LastEditTime: 2025-11-14 13:58:47
 * @Description: 
 */
import React, { useState, useCallback, useRef } from 'react';
import { Eye, Download, MousePointer, Share2, RefreshCw, Monitor } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useEChartsConfig } from '../hooks/useEChartsConfig';
import { useConfigManager } from '../hooks/useConfigManager';
import { downloadFile } from '../lib/utils';
import html2canvas from 'html2canvas';

interface ChartPreviewProps {
  exportChart: (format: 'png' | 'jpeg') => void;
  onShare: () => void;
}

export const ChartPreview: React.FC<ChartPreviewProps> = ({ exportChart, onShare }) => {
  const { chartRef, updateChart, exportImage, manualResize } = useEChartsConfig();
  const { config, addConfigChangeListener, validationErrors } = useConfigManager();
  const [interactionMode, setInteractionMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [configVersion, setConfigVersion] = useState(0);
  const lastConfigRef = useRef<string>('');

  // ✅ 修复：优化配置监听，减少不必要的重新渲染
  const configRef = useRef(config);
  configRef.current = config;

  // ✅ 修复：简化依赖数组，避免闭包陷阱和无限循环
  const memoizedUpdateChart = React.useCallback(() => {
    if (validationErrors.length === 0) {
      console.log('ChartPreview: Updating chart with new config', config.title.text);
      console.log('ChartPreview: Full config object:', JSON.stringify(config, null, 2));
      updateChart(config);
    }
  }, [config, updateChart, validationErrors.length]);

  React.useEffect(() => {
    memoizedUpdateChart();
  }, [memoizedUpdateChart]);

  // ✅ 修复：使用版本控制机制确保配置变化时强制更新
  React.useEffect(() => {
    const unsubscribe = addConfigChangeListener(() => {
      console.log('ChartPreview: Config change listener triggered, incrementing version');
      setConfigVersion(prev => prev + 1);
    });

    return unsubscribe;
  }, [addConfigChangeListener]);

  // ✅ 修复：当版本变化时，强制更新图表
  React.useEffect(() => {
    console.log('ChartPreview: Config version changed to:', configVersion);
    console.log('ChartPreview: Current config title:', config.title.text);

    if (validationErrors.length === 0) {
      console.log('ChartPreview: Updating chart due to version change');
      memoizedUpdateChart();
    }
  }, [configVersion, memoizedUpdateChart, validationErrors]);

  // 监听自定义刷新事件
  React.useEffect(() => {
    const handleRefreshEvent = () => {
      setIsUpdating(true);
      manualResize();
      if (validationErrors.length === 0) {
        updateChart(config);
      }
      setTimeout(() => setIsUpdating(false), 300);
    };

    window.addEventListener('refreshClientChart', handleRefreshEvent);

    return () => {
      window.removeEventListener('refreshClientChart', handleRefreshEvent);
    };
  }, [config, updateChart, manualResize, validationErrors]);

  const handleExportImage = async (format: 'png' | 'jpeg' = 'png') => {
    try {
      if (chartRef.current) {
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
          useCORS: true
        });

        const dataURL = canvas.toDataURL(`image/${format}`);
        const link = document.createElement('a');
        link.download = `chart-client.${format}`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Export failed:', error);
      // Fallback to ECharts export
      exportChart(format);
    }
  };

  const toggleInteractionMode = () => {
    setInteractionMode(!interactionMode);
  };

  const copyConfig = async () => {
    const configString = JSON.stringify(config, null, 2);
    try {
      await navigator.clipboard.writeText(configString);
      alert('配置已复制到剪贴板');
    } catch (error) {
      console.error('Failed to copy config:', error);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 p-0">
        <div className="relative w-full h-full min-h-[300px]">
          {/* 错误状态显示 */}
          {validationErrors.length > 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center p-6">
                <div className="text-red-500 text-lg mb-2">⚠️ 配置错误</div>
                <div className="text-gray-600 text-sm max-w-md">
                  {validationErrors.slice(0, 3).map((error, index) => (
                    <div key={index} className="mb-1">{error}</div>
                  ))}
                  {validationErrors.length > 3 && (
                    <div className="text-gray-500">还有 {validationErrors.length - 3} 个错误...</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              ref={chartRef}
              className={`w-full h-full ${interactionMode ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
            />
          )}

          {/* 状态指示器 */}
          {isUpdating && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
              更新中
            </div>
          )}

          {interactionMode && (
            <div className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-md text-sm">
              客户端交互模式已启用
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};