/*
 * @Author: oliver
 * @Date: 2025-11-14 13:40:00
 * @LastEditors: oliver
 * @LastEditTime: 2025-11-14 14:07:53
 * @Description: 
 */
import React, { useState } from 'react';
import { Eye, Monitor, ArrowUpDown, RefreshCw, Download } from 'lucide-react';
import { Button } from './ui/button';
import { ChartPreview } from './ChartPreview';
import { ServerRender } from './ServerRender';

interface ChartPreviewSplitProps {
  exportChart: (format: 'png' | 'jpeg') => void;
  onShare: () => void;
}

export const ChartPreviewSplit: React.FC<ChartPreviewSplitProps> = ({
  exportChart,
  onShare
}) => {
  const [clientHeight, setClientHeight] = useState(50); // 百分比

  const handleHeightChange = (delta: number) => {
    setClientHeight(prev => Math.max(20, Math.min(80, prev + delta)));
  };

  // 客户端渲染按钮处理函数
  const handleClientRefresh = () => {
    // 触发客户端图表刷新
    const event = new CustomEvent('refreshClientChart');
    window.dispatchEvent(event);
  };

  const handleClientExport = () => {
    exportChart('png');
  };

  // 服务端渲染按钮处理函数
  const handleServerRefresh = () => {
    // 触发服务端图表刷新
    const event = new CustomEvent('refreshServerChart');
    window.dispatchEvent(event);
  };

  const handleServerDownload = () => {
    const event = new CustomEvent('downloadServerChart');
    window.dispatchEvent(event);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 预览区域 */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* 客户端渲染区域 */}
        <div
          className="relative flex flex-col overflow-hidden"
          style={{ height: `${clientHeight}%` }}
        >
          <div className="px-3 py-1 bg-blue-50 border-b border-blue-200 z-10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">客户端渲染</span>
                <span className="text-xs text-blue-600">
                  (使用 ECharts JavaScript 库)
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs hover:bg-blue-100"
                  title="刷新图表"
                  onClick={handleClientRefresh}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs hover:bg-blue-100"
                  title="导出PNG"
                  onClick={handleClientExport}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden chart-content">
            <ChartPreview exportChart={exportChart} onShare={onShare} />
          </div>
        </div>

        {/* 分割线和间距 */}
        <div className="h-5 bg-background flex-shrink-0 relative">
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
          </div>
        </div>

        {/* 服务端渲染区域 */}
        <div
          className="relative flex flex-col overflow-hidden"
          style={{ height: `${100 - clientHeight}%` }}
        >
          <div className="px-3 py-1 bg-green-50 border-b border-green-200 z-10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Monitor className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">服务端渲染</span>
                <span className="text-xs text-green-600">
                  (Node.js + skia-canvas 生成 PNG)
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs hover:bg-green-100"
                  title="重新渲染"
                  onClick={handleServerRefresh}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs hover:bg-green-100"
                  title="下载PNG"
                  onClick={handleServerDownload}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden chart-content">
            <ServerRender
              width={800}
              height={600}
            />
          </div>
        </div>
      </div>
    </div>
  );
};