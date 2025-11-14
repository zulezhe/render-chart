import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { useConfigManager } from '../../hooks/useConfigManager';

export const TooltipConfig: React.FC = () => {
  const { config, updateConfig } = useConfigManager();

  const updateTooltipConfig = (path: string, value: any) => {
    updateConfig({
      ...config,
      tooltip: {
        ...config.tooltip,
        [path]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* 基础设置 */}
      <div>
        <h4 className="text-sm font-medium mb-4 pb-2 border-b">基础设置</h4>
        <div className="space-y-4 pl-2">
          {/* 显示提示框 */}
          <div className="flex items-center justify-between">
            <Label htmlFor="tooltip-show" className="text-xs">显示提示框</Label>
            <Switch
              id="tooltip-show"
              checked={config.tooltip?.show !== false}
              onCheckedChange={(checked) => updateTooltipConfig('show', checked)}
            />
          </div>

          {/* 触发类型 */}
          {config.tooltip?.show !== false && (
            <div className="space-y-2">
              <Label htmlFor="tooltip-trigger" className="text-xs">触发方式</Label>
              <Select
                value={config.tooltip?.trigger || 'axis'}
                onValueChange={(value) => updateTooltipConfig('trigger', value)}
              >
                <SelectTrigger id="tooltip-trigger" className="h-8">
                  <SelectValue placeholder="选择触发方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="item">数据项触发</SelectItem>
                  <SelectItem value="axis">坐标轴触发</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* 样式设置 */}
      {config.tooltip?.show !== false && (
        <div>
          <h4 className="text-sm font-medium mb-4 pb-2 border-b">样式设置</h4>
          <div className="space-y-4 pl-2">
            {/* 背景颜色 */}
            <div className="space-y-2">
              <Label htmlFor="tooltip-backgroundColor" className="text-xs">背景颜色</Label>
              <Input
                id="tooltip-backgroundColor"
                type="color"
                value={config.tooltip?.backgroundColor || 'rgba(50,50,50,0.9)'}
                onChange={(e) => updateTooltipConfig('backgroundColor', e.target.value)}
                className="h-8 w-20"
              />
            </div>

            {/* 边框颜色 */}
            <div className="space-y-2">
              <Label htmlFor="tooltip-borderColor" className="text-xs">边框颜色</Label>
              <Input
                id="tooltip-borderColor"
                type="color"
                value={config.tooltip?.borderColor || '#333'}
                onChange={(e) => updateTooltipConfig('borderColor', e.target.value)}
                className="h-8 w-20"
              />
            </div>

            {/* 文字颜色 */}
            <div className="space-y-2">
              <Label htmlFor="tooltip-textStyle-color" className="text-xs">文字颜色</Label>
              <Input
                id="tooltip-textStyle-color"
                type="color"
                value={config.tooltip?.textStyle?.color || '#fff'}
                onChange={(e) => updateTooltipConfig('textStyle', { ...config.tooltip?.textStyle, color: e.target.value })}
                className="h-8 w-20"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};