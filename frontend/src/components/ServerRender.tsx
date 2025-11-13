import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useConfigManager } from '../hooks/useConfigManager';
import { apiService } from '../services/api';

interface ServerRenderProps {
  width?: number;
  height?: number;
}

export const ServerRender: React.FC<ServerRenderProps> = ({
  width = 800,
  height = 600
}) => {
  const { config } = useConfigManager();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [lastRenderTime, setLastRenderTime] = useState<number>(0);

  // 监听配置变化，自动重新渲染
  useEffect(() => {
    if (config && config.series && config.series.length > 0) {
      handleServerRender();
    } else {
      setImageUrl('');
      setError('');
    }
  }, [config]);

  const handleServerRender = async () => {
    if (!config || !config.series || config.series.length === 0) {
      setError('请先配置图表数据');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const startTime = Date.now();
      const response = await apiService.renderChartAsPng(config, width, height);

      if (response.success && response.data) {
        // 创建临时URL
        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
        setLastRenderTime(Date.now() - startTime);

        // 清理旧的URL
        return () => {
          if (url) {
            URL.revokeObjectURL(url);
          }
        };
      } else {
        setError(response.error || '服务端渲染失败');
        setImageUrl('');
      }
    } catch (err) {
      setError('渲染请求失败');
      setImageUrl('');
      console.error('Server render error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `chart-server-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatRenderTime = (time: number) => {
    return time < 1000 ? `${time}ms` : `${(time / 1000).toFixed(2)}s`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Monitor className="h-5 w-5 text-green-600" />
          服务端渲染
        </CardTitle>
        <div className="flex items-center gap-2">
          {lastRenderTime > 0 && (
            <span className="text-xs text-muted-foreground">
              渲染时间: {formatRenderTime(lastRenderTime)}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleServerRender}
            disabled={isLoading || !config?.series?.length}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? '渲染中...' : '重新渲染'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!imageUrl}
          >
            <Download className="h-4 w-4 mr-1" />
            下载PNG
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="w-full h-full relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                正在服务端渲染图表...
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-10">
              <div className="flex flex-col items-center gap-2 text-center max-w-md">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <div className="text-sm text-destructive">{error}</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleServerRender}
                  className="mt-2"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  重试
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !error && imageUrl && (
            <div className="w-full h-full flex items-center justify-center p-4 bg-muted/20">
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Server-rendered chart"
                  className="max-w-full max-h-full object-contain shadow-lg rounded"
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  服务端渲染 {width}×{height}
                </div>
              </div>
            </div>
          )}

          {!isLoading && !error && !imageUrl && (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Monitor className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <div className="text-sm">
                  配置图表后，这里将显示服务端渲染结果
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};