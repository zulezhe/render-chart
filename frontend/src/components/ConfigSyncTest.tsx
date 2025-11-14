import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useConfigManager } from '../hooks/useConfigManager';
import { ConfigSyncMonitor } from './ConfigSyncMonitor';

export const ConfigSyncTest: React.FC = () => {
  const { config, updateConfig, isUpdating, jsonConfig } = useConfigManager();
  const [testTitle, setTestTitle] = useState('');
  const [monitorEnabled, setMonitorEnabled] = useState(true);

  // 测试直接更新配置
  const handleDirectUpdate = () => {
    const newTitle = `测试标题_${Date.now().slice(-6)}`;
    updateConfig({
      title: {
        ...config.title,
        text: newTitle
      }
    });
    setTestTitle(newTitle);
  };

  // 测试批量更新
  const handleBatchUpdate = () => {
    updateConfig({
      title: {
        ...config.title,
        text: `批量更新_${Date.now().slice(-6)}`,
        textStyle: {
          ...config.title.textStyle,
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`
        }
      },
      xAxis: {
        ...config.xAxis,
        name: `X轴_${Date.now().slice(-6)}`
      }
    });
  };

  // 测试快速连续更新
  const handleRapidUpdate = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        updateConfig({
          title: {
            ...config.title,
            text: `快速更新_${i + 1}_${Date.now().slice(-6)}`
          }
        });
      }, i * 100);
    }
  };

  // 测试自定义更新
  const handleCustomUpdate = () => {
    if (testTitle.trim()) {
      updateConfig({
        title: {
          ...config.title,
          text: testTitle
        }
      });
    }
  };

  // 测试重置
  const handleReset = () => {
    const { resetConfig } = useConfigManager();
    resetConfig();
    setTestTitle('');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🧪 配置同步测试工具</span>
            <Button
              variant={monitorEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setMonitorEnabled(!monitorEnabled)}
            >
              {monitorEnabled ? '隐藏' : '显示'} 监控器
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 当前状态 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">当前配置状态</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label>图表标题</Label>
                <div className="font-mono bg-white p-2 rounded border">
                  {config.title.text}
                </div>
              </div>
              <div>
                <Label>更新状态</Label>
                <div className={`p-2 rounded border text-center ${
                  isUpdating
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                    : 'bg-green-100 text-green-800 border-green-300'
                }`}>
                  {isUpdating ? '🔄 更新中...' : '✅ 就绪'}
                </div>
              </div>
            </div>
          </div>

          {/* 测试控件 */}
          <div className="space-y-4">
            <h3 className="font-medium">测试控件</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="test-title">自定义标题</Label>
                <Input
                  id="test-title"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="输入测试标题"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleCustomUpdate} disabled={!testTitle.trim() || isUpdating}>
                  应用自定义标题
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button onClick={handleDirectUpdate} disabled={isUpdating}>
                直接更新标题
              </Button>
              <Button onClick={handleBatchUpdate} disabled={isUpdating} variant="outline">
                批量更新
              </Button>
              <Button onClick={handleRapidUpdate} disabled={isUpdating} variant="outline">
                快速连续更新
              </Button>
              <Button onClick={handleReset} disabled={isUpdating} variant="destructive">
                重置配置
              </Button>
            </div>
          </div>

          {/* JSON预览 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">JSON配置预览 (标题部分)</h3>
            <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
              {JSON.stringify({
                title: {
                  text: config.title.text,
                  textStyle: config.title.textStyle
                }
              }, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* 配置同步监控器 */}
      <ConfigSyncMonitor enabled={monitorEnabled} />
    </div>
  );
};