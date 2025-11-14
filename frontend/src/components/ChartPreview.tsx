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
  const { config } = useConfigManager();
  const [interactionMode, setInteractionMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const lastConfigRef = useRef<string>('');

  // 监听配置变化
  React.useEffect(() => {
    updateChart(config);
  }, [config, updateChart]);

  // 监听自定义刷新事件
  React.useEffect(() => {
    const handleRefreshEvent = () => {
      manualResize();
      updateChart(config);
    };

    window.addEventListener('refreshClientChart', handleRefreshEvent);

    return () => {
      window.removeEventListener('refreshClientChart', handleRefreshEvent);
    };
  }, [config, updateChart, manualResize]);

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
          <div
            ref={chartRef}
            className={`w-full h-full ${interactionMode ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
          />

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