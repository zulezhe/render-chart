import React, { useState } from 'react';
import { Eye, Monitor, ArrowUpDown } from 'lucide-react';
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
  const [showLabels, setShowLabels] = useState(true);
  const [clientHeight, setClientHeight] = useState(50); // 百分比

  const handleHeightChange = (delta: number) => {
    setClientHeight(prev => Math.max(20, Math.min(80, prev + delta)));
  };

  return (
    <div className="h-full flex flex-col">
      {/* 控制栏 */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/20">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">图表预览</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleHeightChange(10)}
              className="h-6 px-2"
              title="增加客户端渲染区域"
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleHeightChange(-10)}
              className="h-6 px-2"
              title="增加服务端渲染区域"
            >
              <Monitor className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setClientHeight(50)}
              className="h-6 px-2"
              title="重置为平均分配"
            >
              <ArrowUpDown className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>客户端: {clientHeight}%</span>
          <span>|</span>
          <span>服务端: {100 - clientHeight}%</span>
        </div>
      </div>

      {/* 预览区域 */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* 客户端渲染区域 */}
        <div
          className="relative flex flex-col"
          style={{ height: `${clientHeight}%` }}
        >
          {showLabels && (
            <div className="px-3 py-1 bg-blue-50 border-b border-blue-200 z-10">
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">客户端渲染</span>
                <span className="text-xs text-blue-600">
                  (使用 ECharts JavaScript 库)
                </span>
              </div>
            </div>
          )}
          <div className="flex-1 min-h-0">
            <ChartPreview exportChart={exportChart} onShare={onShare} />
          </div>
        </div>

        {/* 分割线 */}
        <div className="h-px bg-border relative">
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
            <div className="bg-background border rounded-full px-2 py-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3 inline mr-1" />
              <Monitor className="h-3 w-3 inline ml-1" />
            </div>
          </div>
        </div>

        {/* 服务端渲染区域 */}
        <div
          className="relative flex flex-col"
          style={{ height: `${100 - clientHeight}%` }}
        >
          {showLabels && (
            <div className="px-3 py-1 bg-green-50 border-b border-green-200 z-10">
              <div className="flex items-center gap-2 text-sm">
                <Monitor className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">服务端渲染</span>
                <span className="text-xs text-green-600">
                  (Node.js + skia-canvas 生成 PNG)
                </span>
              </div>
            </div>
          )}
          <div className="flex-1 min-h-0">
            <ServerRender
              width={800}
              height={600}
            />
          </div>
        </div>
      </div>

      {/* 底部控制 */}
      <div className="flex items-center justify-between p-2 border-t bg-muted/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLabels(!showLabels)}
          className="text-xs"
        >
          {showLabels ? '隐藏' : '显示'}标签
        </Button>
        <div className="text-xs text-muted-foreground">
          拖动上方按钮调整区域大小
        </div>
      </div>
    </div>
  );
};