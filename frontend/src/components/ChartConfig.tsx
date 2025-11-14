import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Settings, Palette, BarChart3, Sliders, List, Film, Cog } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartType, ConfigPanelState } from '../types/chart';
import { useConfigManager } from '../hooks/useConfigManager';
import { AxisConfig } from './chart-config/AxisConfig';
import { LegendConfig } from './chart-config/LegendConfig';
import { TooltipConfig } from './chart-config/TooltipConfig';
import { GridConfig } from './chart-config/GridConfig';

interface ChartConfigProps {
  onConfigChange: () => void;
}

export const ChartConfig: React.FC<ChartConfigProps> = ({ onConfigChange }) => {
  const { config, chartType, updateConfig, updateSeriesType, updateSeriesData } = useConfigManager();
  const [expandedPanels, setExpandedPanels] = useState<ConfigPanelState>({
    basic: true,
    global: false,
    axis: false,
    legend: false,
    series: false,
    animation: false,
    advanced: false
  });

  // 新增的配置分组状态
  const [activeConfigGroup, setActiveConfigGroup] = useState<string>('axis');

  const togglePanel = (panel: keyof ConfigPanelState) => {
    setExpandedPanels(prev => ({
      ...prev,
      [panel]: !prev[panel]
    }));
  };

  const handleConfigUpdate = (updates: any) => {
    updateConfig(updates);
    onConfigChange();
  };

  const handleSeriesUpdate = (seriesIndex: number, field: string, value: any) => {
    updateSeriesData(seriesIndex, field, value);
    onConfigChange();
  };

  const chartTypes: { value: ChartType; label: string }[] = [
    { value: 'line', label: '折线图' },
    { value: 'bar', label: '柱状图' },
    { value: 'pie', label: '饼图' },
    { value: 'scatter', label: '散点图' },
    { value: 'radar', label: '雷达图' },
    { value: 'gauge', label: '仪表盘' }
  ];

  return (
    <div className="w-full h-full overflow-y-auto space-y-4 p-4">
      {/* 基础设置 */}
      <Card className="overflow-hidden">
        <CardHeader
          className="cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          onClick={() => togglePanel('basic')}
        >
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-blue-600" />
              基础设置
            </div>
            {expandedPanels.basic ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </CardTitle>
        </CardHeader>
        {expandedPanels.basic && (
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="chart-type">图表类型</Label>
              <Select
                value={chartType}
                onValueChange={(value: ChartType) => {
                  updateSeriesType(value);
                  onConfigChange();
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {chartTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="chart-title">图表标题</Label>
              <Input
                id="chart-title"
                value={config.title.text}
                onChange={(e) => handleConfigUpdate({
                  title: { ...config.title, text: e.target.value }
                })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="x-axis-name">X轴名称</Label>
                <Input
                  id="x-axis-name"
                  value={config.xAxis.name}
                  onChange={(e) => handleConfigUpdate({
                    xAxis: { ...config.xAxis, name: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="y-axis-name">Y轴名称</Label>
                <Input
                  id="y-axis-name"
                  value={config.yAxis.name}
                  onChange={(e) => handleConfigUpdate({
                    yAxis: { ...config.yAxis, name: e.target.value }
                  })}
                />
              </div>
            </div>

            {/* 数据配置 */}
            <div>
              <Label>X轴数据（逗号分隔）</Label>
              <Input
                value={config.xAxis.data.join(',')}
                onChange={(e) => handleConfigUpdate({
                  xAxis: { ...config.xAxis, data: e.target.value.split(',').map(item => item.trim()) }
                })}
              />
            </div>

            {config.series.map((series, index) => (
              <div key={index} className="space-y-2 p-3 border rounded-lg">
                <h4 className="font-medium">系列 {index + 1}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>名称</Label>
                    <Input
                      value={series.name}
                      onChange={(e) => handleSeriesUpdate(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>数据（逗号分隔）</Label>
                    <Input
                      value={series.data.join(',')}
                      onChange={(e) => handleSeriesUpdate(index, 'data',
                        e.target.value.split(',').map(item => parseFloat(item.trim()) || 0)
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* 全局样式 */}
      <Card className="overflow-hidden">
        <CardHeader
          className="cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          onClick={() => togglePanel('global')}
        >
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-blue-600" />
              全局样式
            </div>
            {expandedPanels.global ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </CardTitle>
        </CardHeader>
        {expandedPanels.global && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title-color">标题颜色</Label>
                <Input
                  id="title-color"
                  type="color"
                  value={config.title.textStyle.color}
                  onChange={(e) => handleConfigUpdate({
                    title: {
                      ...config.title,
                      textStyle: { ...config.title.textStyle, color: e.target.value }
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="title-size">标题大小</Label>
                <Input
                  id="title-size"
                  type="number"
                  value={config.title.textStyle.fontSize}
                  onChange={(e) => handleConfigUpdate({
                    title: {
                      ...config.title,
                      textStyle: { ...config.title.textStyle, fontSize: parseInt(e.target.value) }
                    }
                  })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bg-color">背景颜色</Label>
                <Input
                  id="bg-color"
                  type="color"
                  value={config.backgroundColor}
                  onChange={(e) => handleConfigUpdate({ backgroundColor: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="padding">图表内边距（上,右,下,左）</Label>
                <Input
                  id="padding"
                  value={config.padding.join(',')}
                  onChange={(e) => handleConfigUpdate({
                    padding: e.target.value.split(',').map(item => parseInt(item.trim()) || 0)
                  })}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 系列样式 */}
      <Card className="overflow-hidden">
        <CardHeader
          className="cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          onClick={() => togglePanel('series')}
        >
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              系列样式
            </div>
            {expandedPanels.series ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </CardTitle>
        </CardHeader>
        {expandedPanels.series && (
          <CardContent className="space-y-4">
            {config.series.map((series, index) => (
              <div key={index} className="space-y-3 p-3 border rounded-lg">
                <h4 className="font-medium">{series.name} 样式</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>颜色</Label>
                    <Input
                      type="color"
                      value={series.itemStyle.color}
                      onChange={(e) => handleSeriesUpdate(index, 'itemStyle', {
                        ...series.itemStyle,
                        color: e.target.value
                      })}
                    />
                  </div>
                  {(chartType === 'line' || chartType === 'bar') && (
                    <div>
                      <Label>
                        {chartType === 'line' ? '线宽' : '柱宽'}
                      </Label>
                      <Input
                        type="number"
                        value={chartType === 'line' ?
                          series.lineStyle?.width || 2 :
                          series.barWidth || 20
                        }
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (chartType === 'line') {
                            handleSeriesUpdate(index, 'lineStyle', {
                              ...series.lineStyle,
                              width: value
                            });
                          } else {
                            handleSeriesUpdate(index, 'barWidth', value);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`show-label-${index}`}
                    checked={series.label.show}
                    onChange={(e) => handleSeriesUpdate(index, 'label', {
                      ...series.label,
                      show: e.target.checked
                    })}
                  />
                  <Label htmlFor={`show-label-${index}`}>显示数据标签</Label>
                </div>

                {series.label.show && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>标签颜色</Label>
                      <Input
                        type="color"
                        value={series.label.color}
                        onChange={(e) => handleSeriesUpdate(index, 'label', {
                          ...series.label,
                          color: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label>标签大小</Label>
                      <Input
                        type="number"
                        value={series.label.fontSize}
                        onChange={(e) => handleSeriesUpdate(index, 'label', {
                          ...series.label,
                          fontSize: parseInt(e.target.value)
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* 高级配置面板 */}
      <Card className="overflow-hidden">
        <CardHeader
          className="cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          onClick={() => togglePanel('advanced')}
        >
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <Cog className="h-4 w-4 text-blue-600" />
              高级配置
            </div>
            {expandedPanels.advanced ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </CardTitle>
        </CardHeader>
        {expandedPanels.advanced && (
          <CardContent className="space-y-4">
            {/* 配置分组导航 */}
            <div className="flex flex-wrap gap-2 pb-4 border-b">
              <Button
                variant={activeConfigGroup === 'axis' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveConfigGroup('axis')}
                className="text-xs"
              >
                坐标轴
              </Button>
              <Button
                variant={activeConfigGroup === 'legend' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveConfigGroup('legend')}
                className="text-xs"
              >
                图例
              </Button>
              <Button
                variant={activeConfigGroup === 'tooltip' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveConfigGroup('tooltip')}
                className="text-xs"
              >
                提示框
              </Button>
              <Button
                variant={activeConfigGroup === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveConfigGroup('grid')}
                className="text-xs"
              >
                网格
              </Button>
            </div>

            {/* 配置内容区域 */}
            <div className="min-h-[200px]">
              {activeConfigGroup === 'axis' && <AxisConfig />}
              {activeConfigGroup === 'legend' && <LegendConfig />}
              {activeConfigGroup === 'tooltip' && <TooltipConfig />}
              {activeConfigGroup === 'grid' && <GridConfig />}
            </div>
          </CardContent>
        )}
      </Card>

      {/* 应用配置按钮 */}
      <Button
        className="w-full"
        onClick={onConfigChange}
      >
        应用配置
      </Button>
    </div>
  );
};