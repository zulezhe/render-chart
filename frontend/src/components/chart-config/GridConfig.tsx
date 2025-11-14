import React, { useEffect } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { useConfigManager } from '../../hooks/useConfigManager';

export const GridConfig: React.FC = () => {
  const { config, updateConfig, addConfigChangeListener } = useConfigManager();

  // 使用配置变化监听器
  useEffect(() => {
    const unsubscribe = addConfigChangeListener(() => {
      // 配置变化时的处理逻辑
    });

    return unsubscribe;
  }, [addConfigChangeListener]);

  const updateGridConfig = (axisType: 'xAxis' | 'yAxis', field: string, value: any) => {
    updateConfig({
      ...config,
      [axisType]: {
        ...config[axisType],
        splitLine: {
          ...config[axisType]?.splitLine,
          [field]: value
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* X轴网格线 */}
      <div>
        <h4 className="text-sm font-medium mb-4 pb-2 border-b">X轴网格线</h4>
        <div className="space-y-4 pl-2">
          {/* 显示网格线 */}
          <div className="flex items-center justify-between">
            <Label htmlFor="xAxis-splitLine-show" className="text-xs">显示网格线</Label>
            <Switch
              id="xAxis-splitLine-show"
              checked={config.xAxis?.splitLine?.show !== false}
              onCheckedChange={(checked) => updateGridConfig('xAxis', 'show', checked)}
            />
          </div>

          {/* 网格线样式 */}
          {config.xAxis?.splitLine?.show !== false && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="xAxis-splitLine-color" className="text-xs">网格线颜色</Label>
                <Input
                  id="xAxis-splitLine-color"
                  type="color"
                  value={config.xAxis?.splitLine?.color || '#e0e0e0'}
                  onChange={(e) => updateGridConfig('xAxis', 'color', e.target.value)}
                  className="h-8 w-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="xAxis-splitLine-width" className="text-xs">网格线宽度</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="xAxis-splitLine-width"
                    min={0.5}
                    max={3}
                    step={0.5}
                    value={[config.xAxis?.splitLine?.width || 1]}
                    onValueChange={([value]) => updateGridConfig('xAxis', 'width', value)}
                    className="flex-1"
                  />
                  <span className="text-xs w-8">{config.xAxis?.splitLine?.width || 1}px</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="xAxis-splitLine-type" className="text-xs">线条类型</Label>
                <select
                  id="xAxis-splitLine-type"
                  value={config.xAxis?.splitLine?.type || 'solid'}
                  onChange={(e) => updateGridConfig('xAxis', 'type', e.target.value)}
                  className="h-8 px-2 border rounded text-sm"
                >
                  <option value="solid">实线</option>
                  <option value="dashed">虚线</option>
                  <option value="dotted">点线</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Y轴网格线 */}
      <div>
        <h4 className="text-sm font-medium mb-4 pb-2 border-b">Y轴网格线</h4>
        <div className="space-y-4 pl-2">
          {/* 显示网格线 */}
          <div className="flex items-center justify-between">
            <Label htmlFor="yAxis-splitLine-show" className="text-xs">显示网格线</Label>
            <Switch
              id="yAxis-splitLine-show"
              checked={config.yAxis?.splitLine?.show !== false}
              onCheckedChange={(checked) => updateGridConfig('yAxis', 'show', checked)}
            />
          </div>

          {/* 网格线样式 */}
          {config.yAxis?.splitLine?.show !== false && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="yAxis-splitLine-color" className="text-xs">网格线颜色</Label>
                <Input
                  id="yAxis-splitLine-color"
                  type="color"
                  value={config.yAxis?.splitLine?.color || '#e0e0e0'}
                  onChange={(e) => updateGridConfig('yAxis', 'color', e.target.value)}
                  className="h-8 w-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yAxis-splitLine-width" className="text-xs">网格线宽度</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="yAxis-splitLine-width"
                    min={0.5}
                    max={3}
                    step={0.5}
                    value={[config.yAxis?.splitLine?.width || 1]}
                    onValueChange={([value]) => updateGridConfig('yAxis', 'width', value)}
                    className="flex-1"
                  />
                  <span className="text-xs w-8">{config.yAxis?.splitLine?.width || 1}px</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yAxis-splitLine-type" className="text-xs">线条类型</Label>
                <select
                  id="yAxis-splitLine-type"
                  value={config.yAxis?.splitLine?.type || 'solid'}
                  onChange={(e) => updateGridConfig('yAxis', 'type', e.target.value)}
                  className="h-8 px-2 border rounded text-sm"
                >
                  <option value="solid">实线</option>
                  <option value="dashed">虚线</option>
                  <option value="dotted">点线</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};