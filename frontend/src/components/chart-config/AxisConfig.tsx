import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { useConfigManager } from '../../hooks/useConfigManager';

export const AxisConfig: React.FC = () => {
  const { config, updateConfig } = useConfigManager();

  // 更新坐标轴配置的通用函数
  const updateAxisConfig = (axisType: 'xAxis' | 'yAxis', path: string, value: any) => {
    updateConfig({
      ...config,
      [axisType]: {
        ...config[axisType],
        [path]: value
      }
    });
  };

  // 更新嵌套配置
  const updateNestedAxisConfig = (axisType: 'xAxis' | 'yAxis', parentPath: string, field: string, value: any) => {
    updateConfig({
      ...config,
      [axisType]: {
        ...config[axisType],
        [parentPath]: {
          ...config[axisType]?.[parentPath],
          [field]: value
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* X轴配置 */}
      <div>
        <h4 className="text-sm font-medium mb-4 pb-2 border-b">X轴配置</h4>
        <div className="space-y-4 pl-2">
          {/* 轴类型 */}
          <div className="space-y-2">
            <Label htmlFor="xAxis-type" className="text-xs">轴类型</Label>
            <Select
              value={config.xAxis?.type || 'category'}
              onValueChange={(value) => updateAxisConfig('xAxis', 'type', value)}
            >
              <SelectTrigger id="xAxis-type" className="h-8">
                <SelectValue placeholder="选择轴类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">类目轴</SelectItem>
                <SelectItem value="value">数值轴</SelectItem>
                <SelectItem value="time">时间轴</SelectItem>
                <SelectItem value="log">对数轴</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 显示轴线 */}
          <div className="flex items-center justify-between">
            <Label htmlFor="xAxis-axisLine-show" className="text-xs">显示轴线</Label>
            <Switch
              id="xAxis-axisLine-show"
              checked={config.xAxis?.axisLine?.show !== false}
              onCheckedChange={(checked) => updateNestedAxisConfig('xAxis', 'axisLine', 'show', checked)}
            />
          </div>

          {/* 轴线样式 */}
          {config.xAxis?.axisLine?.show !== false && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="xAxis-axisLine-color" className="text-xs">轴线颜色</Label>
                <Input
                  id="xAxis-axisLine-color"
                  type="color"
                  value={config.xAxis?.axisLine?.color || '#333'}
                  onChange={(e) => updateNestedAxisConfig('xAxis', 'axisLine', 'color', e.target.value)}
                  className="h-8 w-20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="xAxis-axisLine-width" className="text-xs">轴线宽度</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="xAxis-axisLine-width"
                    min={1}
                    max={5}
                    step={0.5}
                    value={[config.xAxis?.axisLine?.width || 1]}
                    onValueChange={([value]) => updateNestedAxisConfig('xAxis', 'axisLine', 'width', value)}
                    className="flex-1"
                  />
                  <span className="text-xs w-8">{config.xAxis?.axisLine?.width || 1}px</span>
                </div>
              </div>
            </div>
          )}

          {/* 轴名称 */}
          <div className="space-y-2">
            <Label htmlFor="xAxis-name" className="text-xs">轴名称</Label>
            <Input
              id="xAxis-name"
              value={config.xAxis?.name || ''}
              onChange={(e) => updateAxisConfig('xAxis', 'name', e.target.value)}
              placeholder="输入X轴名称"
              className="h-8"
            />
          </div>
        </div>
      </div>

      {/* Y轴配置 */}
      <div>
        <h4 className="text-sm font-medium mb-4 pb-2 border-b">Y轴配置</h4>
        <div className="space-y-4 pl-2">
          {/* 轴类型 */}
          <div className="space-y-2">
            <Label htmlFor="yAxis-type" className="text-xs">轴类型</Label>
            <Select
              value={config.yAxis?.type || 'value'}
              onValueChange={(value) => updateAxisConfig('yAxis', 'type', value)}
            >
              <SelectTrigger id="yAxis-type" className="h-8">
                <SelectValue placeholder="选择轴类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">类目轴</SelectItem>
                <SelectItem value="value">数值轴</SelectItem>
                <SelectItem value="time">时间轴</SelectItem>
                <SelectItem value="log">对数轴</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 显示轴线 */}
          <div className="flex items-center justify-between">
            <Label htmlFor="yAxis-axisLine-show" className="text-xs">显示轴线</Label>
            <Switch
              id="yAxis-axisLine-show"
              checked={config.yAxis?.axisLine?.show !== false}
              onCheckedChange={(checked) => updateNestedAxisConfig('yAxis', 'axisLine', 'show', checked)}
            />
          </div>

          {/* 轴名称 */}
          <div className="space-y-2">
            <Label htmlFor="yAxis-name" className="text-xs">轴名称</Label>
            <Input
              id="yAxis-name"
              value={config.yAxis?.name || ''}
              onChange={(e) => updateAxisConfig('yAxis', 'name', e.target.value)}
              placeholder="输入Y轴名称"
              className="h-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};