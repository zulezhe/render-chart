import React, { useEffect } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { useConfigManager } from '../../hooks/useConfigManager';

export const LegendConfig: React.FC = () => {
  const { config, updateConfig, addConfigChangeListener } = useConfigManager();

  // 使用配置变化监听器
  useEffect(() => {
    const unsubscribe = addConfigChangeListener(() => {
      // 配置变化时的处理逻辑
    });

    return unsubscribe;
  }, [addConfigChangeListener]);

  // 更新图例配置的通用函数
  const updateLegendConfig = (path: string, value: any) => {
    updateConfig({
      ...config,
      legend: {
        ...config.legend,
        [path]: value
      }
    });
  };

  // 更新嵌套配置
  const updateNestedLegendConfig = (parentPath: string, field: string, value: any) => {
    updateConfig({
      ...config,
      legend: {
        ...config.legend,
        [parentPath]: {
          ...config.legend?.[parentPath],
          [field]: value
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* 基础设置 */}
      <div>
        <h4 className="text-sm font-medium mb-4 pb-2 border-b">基础设置</h4>
        <div className="space-y-4 pl-2">
          {/* 显示图例 */}
          <div className="flex items-center justify-between">
            <Label htmlFor="legend-show" className="text-xs">显示图例</Label>
            <Switch
              id="legend-show"
              checked={config.legend?.show !== false}
              onCheckedChange={(checked) => updateLegendConfig('show', checked)}
            />
          </div>

          {/* 图例类型 */}
          {config.legend?.show !== false && (
            <div className="space-y-2">
              <Label htmlFor="legend-type" className="text-xs">图例类型</Label>
              <Select
                value={config.legend?.type || 'plain'}
                onValueChange={(value) => updateLegendConfig('type', value)}
              >
                <SelectTrigger id="legend-type" className="h-8">
                  <SelectValue placeholder="选择图例类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plain">普通图例</SelectItem>
                  <SelectItem value="scroll">滚动图例</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* 位置设置 */}
      {config.legend?.show !== false && (
        <div>
          <h4 className="text-sm font-medium mb-4 pb-2 border-b">位置设置</h4>
          <div className="space-y-4 pl-2">
            {/* 水平位置 */}
            <div className="space-y-2">
              <Label htmlFor="legend-left" className="text-xs">水平位置</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="legend-left"
                  min={0}
                  max={100}
                  step={1}
                  value={[config.legend?.left !== undefined ? config.legend.left : 80]}
                  onValueChange={([value]) => updateLegendConfig('left', value)}
                  className="flex-1"
                />
                <span className="text-xs w-8">{config.legend?.left || 80}%</span>
              </div>
            </div>

            {/* 垂直位置 */}
            <div className="space-y-2">
              <Label htmlFor="legend-top" className="text-xs">垂直位置</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="legend-top"
                  min={0}
                  max={100}
                  step={1}
                  value={[config.legend?.top !== undefined ? config.legend.top : 10]}
                  onValueChange={([value]) => updateLegendConfig('top', value)}
                  className="flex-1"
                />
                <span className="text-xs w-8">{config.legend?.top || 10}%</span>
              </div>
            </div>

            {/* 方向 */}
            <div className="space-y-2">
              <Label htmlFor="legend-orient" className="text-xs">排列方向</Label>
              <Select
                value={config.legend?.orient || 'horizontal'}
                onValueChange={(value) => updateLegendConfig('orient', value)}
              >
                <SelectTrigger id="legend-orient" className="h-8">
                  <SelectValue placeholder="选择排列方向" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">水平排列</SelectItem>
                  <SelectItem value="vertical">垂直排列</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* 样式设置 */}
      {config.legend?.show !== false && (
        <div>
          <h4 className="text-sm font-medium mb-4 pb-2 border-b">样式设置</h4>
          <div className="space-y-4 pl-2">
            {/* 文字颜色 */}
            <div className="space-y-2">
              <Label htmlFor="legend-textStyle-color" className="text-xs">文字颜色</Label>
              <Input
                id="legend-textStyle-color"
                type="color"
                value={config.legend?.textStyle?.color || '#333'}
                onChange={(e) => updateNestedLegendConfig('textStyle', 'color', e.target.value)}
                className="h-8 w-20"
              />
            </div>

            {/* 文字大小 */}
            <div className="space-y-2">
              <Label htmlFor="legend-textStyle-fontSize" className="text-xs">文字大小</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="legend-textStyle-fontSize"
                  min={8}
                  max={20}
                  step={1}
                  value={[config.legend?.textStyle?.fontSize || 12]}
                  onValueChange={([value]) => updateNestedLegendConfig('textStyle', 'fontSize', value)}
                  className="flex-1"
                />
                <span className="text-xs w-8">{config.legend?.textStyle?.fontSize || 12}px</span>
              </div>
            </div>

            {/* 背景颜色 */}
            <div className="space-y-2">
              <Label htmlFor="legend-backgroundColor" className="text-xs">背景颜色</Label>
              <Input
                id="legend-backgroundColor"
                type="color"
                value={config.legend?.backgroundColor || 'transparent'}
                onChange={(e) => updateLegendConfig('backgroundColor', e.target.value)}
                className="h-8 w-20"
              />
            </div>

            {/* 边框颜色 */}
            <div className="space-y-2">
              <Label htmlFor="legend-borderColor" className="text-xs">边框颜色</Label>
              <Input
                id="legend-borderColor"
                type="color"
                value={config.legend?.borderColor || '#ccc'}
                onChange={(e) => updateLegendConfig('borderColor', e.target.value)}
                className="h-8 w-20"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};