# ECharts 配置平台联动架构文档

## 概述

本文档描述了 ECharts 配置平台的联动功能实现，包括配置管理、双向绑定、性能优化和错误处理机制。

## 核心架构

### 1. 配置管理中心 - useConfigManager Hook

**位置**: `src/hooks/useConfigManager.ts`

**核心功能**:
- 统一管理所有配置状态
- 提供配置变化监听器机制
- 实现防抖更新优化性能
- 配置验证和错误处理
- 双向数据绑定支持

**主要 API**:
```typescript
interface ConfigManagerAPI {
  config: ChartConfig;                    // 当前配置对象
  chartType: ChartType;                   // 图表类型
  jsonConfig: string;                     // JSON 字符串格式配置
  validationErrors: string[];             // 验证错误列表
  isUpdating: boolean;                    // 更新状态标识

  updateConfig: (updates: Partial<ChartConfig>) => void;
  updateSeriesType: (type: ChartType) => void;
  updateSeriesData: (index: number, field: string, value: any) => void;
  updateConfigFromJson: (jsonString: string) => boolean;
  resetConfig: () => void;

  addConfigChangeListener: (listener: () => void) => () => void;
  getConfigSummary: () => ConfigSummary;
  validateConfig: () => ValidationResult;
}
```

### 2. 配置联动机制

#### 监听器模式
所有组件通过 `addConfigChangeListener` 注册配置变化监听器：

```typescript
// 在组件中使用
useEffect(() => {
  const unsubscribe = addConfigChangeListener(() => {
    // 配置变化时的处理逻辑
    // 自动同步到其他组件
  });

  return unsubscribe; // 清理监听器
}, [addConfigChangeListener]);
```

#### 防抖更新机制
- **配置面板**: 100ms 防抖
- **JSON 编辑器**: 300ms 防抖
- **图表渲染**: 150ms 防抖

```typescript
const debouncedUpdateConfig = useCallback((updates: Partial<ChartConfig>) => {
  if (debounceTimerRef.current) {
    clearTimeout(debounceTimerRef.current);
  }

  debounceTimerRef.current = setTimeout(() => {
    // 执行实际更新
    setConfig(prev => deepMerge(prev, updates));
    notifyConfigChange();
  }, 100);
}, [notifyConfigChange]);
```

### 3. 双向绑定实现

#### 配置面板 → JSON 编辑器
配置面板的任何修改都会：
1. 更新内部配置对象
2. 自动生成 JSON 字符串
3. 同步到 JSON 编辑器显示

#### JSON 编辑器 → 配置面板
JSON 编辑器的修改：
1. 验证 JSON 格式
2. 解析为配置对象
3. 验证配置结构
4. 同步到配置面板

#### 配置面板/JSON 编辑器 → 图表预览
通过配置监听器自动触发图表重新渲染。

### 4. 错误处理机制

#### 配置验证
```typescript
const validateConfig = (config: any): ValidationResult => {
  const errors: string[] = [];

  // 基础结构验证
  if (!config || typeof config !== 'object') {
    errors.push('配置必须是一个有效的对象');
  }

  // 必要字段验证
  if (!config.series || !Array.isArray(config.series)) {
    errors.push('series 字段必须是数组');
  }

  // 数据系列验证
  config.series?.forEach((series: any, index: number) => {
    if (!series.type) {
      errors.push(`系列 ${index + 1} 缺少 type 字段`);
    }
    if (!series.data || !Array.isArray(series.data)) {
      errors.push(`系列 ${index + 1} 的 data 字段必须是数组`);
    }
  });

  return { isValid: errors.length === 0, errors };
};
```

#### 错误显示
- 配置面板：顶部显示错误列表
- JSON 编辑器：顶部显示错误提示
- 图表预览：错误时显示友好提示

### 5. 性能优化策略

#### 防抖机制
不同组件使用不同的防抖延迟：
- 配置面板：100ms（快速响应）
- JSON 编辑器：300ms（避免频繁解析）
- 图表渲染：150ms（平衡性能和响应）

#### 深度合并算法
```typescript
const deepMerge = (target: any, source: any): any => {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }

  return result;
};
```

#### 状态管理优化
- 使用 `useCallback` 避免函数重新创建
- 配置监听器自动清理机制
- 避免不必要的重渲染

### 6. 组件架构

#### 主要组件
1. **LayoutManager**: 主布局管理器
2. **ChartConfig**: 基础配置面板
3. **ConfigEditor**: JSON 编辑器
4. **ChartPreview**: 图表预览组件
5. **AxisConfig**: 坐标轴配置
6. **LegendConfig**: 图例配置
7. **TooltipConfig**: 提示框配置
8. **GridConfig**: 网格配置

#### 高级配置组件
所有高级配置组件都遵循统一模式：
```typescript
export const XxxConfig: React.FC = () => {
  const { config, updateConfig, addConfigChangeListener } = useConfigManager();

  // 配置变化监听
  useEffect(() => {
    const unsubscribe = addConfigChangeListener(() => {
      // 处理配置变化
    });
    return unsubscribe;
  }, [addConfigChangeListener]);

  // 配置更新函数
  const updateXxxConfig = (path: string, value: any) => {
    updateConfig({
      [path]: value
    });
  };

  // 渲染UI
  return (
    // 配置UI
  );
};
```

### 7. 调试和监控

#### 性能监控
- `usePerformanceMonitor` Hook 监控组件性能
- 开发环境下自动输出性能警告
- 渲染次数和耗时统计

#### 调试工具
- `ConfigDebug` 组件显示实时配置状态
- 调试模式切换按钮
- 配置变化日志记录

## 使用指南

### 1. 添加新的配置选项

1. 在 `types/chart.ts` 中添加类型定义
2. 在 `useConfigManager` 的默认配置中添加默认值
3. 在相应的配置组件中添加 UI 控件
4. 使用 `updateConfig` 方法更新配置

### 2. 添加新的高级配置组件

1. 创建新的组件文件
2. 遵循标准组件模式
3. 使用 `addConfigChangeListener` 监听变化
4. 在 `ChartConfig` 中注册新组件

### 3. 自定义验证规则

在 `validateConfig` 函数中添加自定义验证逻辑。

## 最佳实践

1. **防抖设置**: 根据组件特性设置合适的防抖延迟
2. **错误处理**: 始终提供友好的错误提示
3. **性能监控**: 定期检查组件性能表现
4. **类型安全**: 使用 TypeScript 严格类型检查
5. **配置验证**: 确保所有配置都经过验证

## 故障排除

### 常见问题

1. **配置不同步**: 检查是否正确使用了 `addConfigChangeListener`
2. **性能问题**: 检查防抖设置和组件重渲染次数
3. **验证错误**: 检查配置格式和必要字段
4. **类型错误**: 确保类型定义与实际配置一致

### 调试步骤

1. 启用调试模式查看实时配置状态
2. 检查控制台错误信息
3. 使用浏览器开发工具监控组件更新
4. 验证 JSON 格式和配置结构