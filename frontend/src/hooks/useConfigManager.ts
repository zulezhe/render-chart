import { useState, useCallback, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { ChartConfig, ChartType } from "../types/chart";

const defaultConfig: ChartConfig = {
  title: {
    text: "示例图表",
    left: "center",
    textStyle: {
      color: "#1e293b",
      fontSize: 18,
      fontWeight: "bold",
    },
  },
  tooltip: {
    trigger: "axis",
    show: true,
    backgroundColor: "#ffffff",
    textStyle: {
      color: "#1e293b",
    },
  },
  legend: {
    data: ["系列1", "系列2"],
    position: "bottom",
    show: true,
    textStyle: {
      color: "#6b7280",
      fontSize: 12,
    },
    itemGap: 15,
    icon: "circle",
    itemWidth: 12,
    itemHeight: 12,
    padding: [10, 10, 10, 10],
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "15%",
    top: "10%",
    containLabel: true,
    show: true,
    borderColor: "transparent",
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    name: "X轴",
    nameTextStyle: {
      color: "#6b7280",
      fontSize: 12,
    },
    data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    axisLine: {
      lineStyle: {
        color: "#e5e7eb",
        width: 1,
        type: "solid",
      },
    },
    axisLabel: {
      color: "#6b7280",
      fontSize: 12,
      rotate: 0,
      padding: [5, 3, 5, 3],
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: "#d1d5db",
        width: 1,
      },
      length: 5,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: "#f3f4f6",
        type: "dashed",
      },
    },
  },
  yAxis: {
    type: "value",
    name: "Y轴",
    nameTextStyle: {
      color: "#6b7280",
      fontSize: 12,
    },
    min: null,
    max: null,
    splitNumber: 5,
    axisLine: {
      lineStyle: {
        color: "#e5e7eb",
        width: 1,
        type: "solid",
      },
    },
    axisLabel: {
      color: "#6b7280",
      fontSize: 12,
      padding: [5, 3, 5, 3],
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: "#d1d5db",
        width: 1,
      },
      length: 5,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: "#f3f4f6",
        type: "dashed",
      },
    },
  },
  toolbox: {
    show: true,
    position: "right-top",
    backgroundColor: "transparent",
    feature: {
      saveAsImage: {},
      dataZoom: {
        show: true,
      },
      restore: {
        show: true,
      },
    },
  },
  animation: true,
  animationDuration: 1500,
  animationEasing: "cubicOut",
  animationDelay: 0,
  animationDurationUpdate: 1000,
  animationEasingUpdate: "cubicOut",
  series: [
    {
      name: "系列1",
      type: "line",
      data: [120, 200, 150, 80, 70, 110, 130],
      smooth: true,
      itemStyle: {
        color: "#3b82f6",
      },
      lineStyle: {
        width: 2,
      },
      label: {
        show: false,
        color: "#1e293b",
        fontSize: 11,
        position: "top",
      },
      barWidth: 20,
      emphasis: {
        itemStyle: {
          scale: true,
          scaleSize: 10,
        },
      },
    },
    {
      name: "系列2",
      type: "line",
      data: [80, 150, 120, 90, 60, 100, 110],
      smooth: true,
      itemStyle: {
        color: "#8b5cf6",
      },
      lineStyle: {
        width: 2,
      },
      label: {
        show: false,
        color: "#1e293b",
        fontSize: 11,
        position: "top",
      },
      barWidth: 20,
      emphasis: {
        itemStyle: {
          scale: true,
          scaleSize: 10,
        },
      },
    },
  ],
  backgroundColor: "#ffffff",
  padding: [20, 30, 30, 30],
  dataZoom: [
    {
      type: "inside",
      xAxisIndex: 0,
      zoomOnMouseWheel: true,
      moveOnMouseMove: true,
      moveOnMouseWheel: true,
    },
  ],
};

// 配置验证函数
const validateConfig = (config: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!config || typeof config !== 'object') {
    errors.push('配置必须是一个有效的对象');
    return { isValid: false, errors };
  }

  // 验证必要的字段
  if (!config.series || !Array.isArray(config.series)) {
    errors.push('series 字段必须是数组');
  }

  if (config.series && config.series.length === 0) {
    errors.push('至少需要一个数据系列');
  }

  // 验证数据系列
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

// 深度合并配置对象
const deepMerge = (target: any, source: any): any => {
  if (!source) return target;
  if (!target) return source;

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

export const useConfigManager = () => {
  const [config, setConfig] = useState<ChartConfig>(defaultConfig);
  const [chartType, setChartType] = useState<ChartType>("line");
  const [jsonConfig, setJsonConfig] = useState<string>(
    JSON.stringify(defaultConfig, null, 2),
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // 防抖定时器
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>();
  // 配置变化监听器
  const configChangeListenersRef = useRef<Set<() => void>>(new Set());

  // 添加配置变化监听器
  const addConfigChangeListener = useCallback((listener: () => void) => {
    configChangeListenersRef.current.add(listener);
    return () => {
      configChangeListenersRef.current.delete(listener);
    };
  }, []);

  // 通知所有监听器
  const notifyConfigChange = useCallback(() => {
    configChangeListenersRef.current.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in config change listener:', error);
      }
    });
  }, []);

  // 防抖更新配置
  const debouncedUpdateConfig = useCallback((updates: Partial<ChartConfig>) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsUpdating(true);
    console.log('useConfigManager: debouncedUpdateConfig called with:', updates);

    debounceTimerRef.current = setTimeout(() => {
      setConfig((prevConfig) => {
        const newConfig = deepMerge(prevConfig, updates);
        console.log('useConfigManager: new config calculated:', newConfig);
        console.log('useConfigManager: new config title:', newConfig.title.text);

        // 验证配置
        const validation = validateConfig(newConfig);
        const jsonString = JSON.stringify(newConfig, null, 2);

        // ✅ 修复：使用unstable_batchedUpdates避免flushSync警告
        import('react-dom').then(({ unstable_batchedUpdates }) => {
          unstable_batchedUpdates(() => {
            setJsonConfig(jsonString);
            setValidationErrors(validation.errors);
            setIsUpdating(false);

            console.log('useConfigManager: all states updated successfully');
            console.log('useConfigManager: jsonConfig updated to:', jsonString.slice(0, 100) + '...');

            // ✅ 修复：在批量更新后立即通知监听器
            notifyConfigChange();
            console.log('useConfigManager: listeners notified');
          });
        });

        return newConfig;
      });
    }, 50); // ✅ 优化防抖时间为50ms，平衡响应性和性能
  }, [notifyConfigChange]);

  const updateConfig = useCallback((updates: Partial<ChartConfig>) => {
    debouncedUpdateConfig(updates);
  }, [debouncedUpdateConfig]);

  const updateSeriesType = useCallback((type: ChartType) => {
    setChartType(type);
    debouncedUpdateConfig({
      series: config.series.map((series, index) => ({
        ...series,
        type,
      })),
    });
  }, [config.series, debouncedUpdateConfig]);

  const updateSeriesData = useCallback(
    (seriesIndex: number, field: string, value: any) => {
      const newSeries = [...config.series];
      newSeries[seriesIndex] = {
        ...newSeries[seriesIndex],
        [field]: value,
      };
      debouncedUpdateConfig({ series: newSeries });
    },
    [config.series, debouncedUpdateConfig],
  );

  const updateConfigFromJson = useCallback((jsonString: string) => {
    try {
      const parsedConfig = JSON.parse(jsonString);
      const validation = validateConfig(parsedConfig);

      if (validation.isValid) {
        setIsUpdating(true);
        console.log('useConfigManager: updateConfigFromJson with valid JSON');

        // ✅ 修复：直接按顺序更新状态，确保同步
        setConfig(parsedConfig);
        setJsonConfig(jsonString);
        setValidationErrors([]);

        // 更新图表类型
        if (parsedConfig.series && parsedConfig.series.length > 0) {
          setChartType(parsedConfig.series[0].type || 'line');
        }

        setIsUpdating(false);
        console.log('useConfigManager: all states updated from JSON');
        console.log('useConfigManager: config title updated to:', parsedConfig.title.text);

        // ✅ 同步通知所有监听器
        setTimeout(() => {
          notifyConfigChange();
          console.log('useConfigManager: listeners notified from JSON update');
        }, 0);

        return true;
      } else {
        setValidationErrors(validation.errors);
        console.log('useConfigManager: validation failed:', validation.errors);
        return false;
      }
    } catch (error) {
      console.error("Invalid JSON configuration:", error);
      setValidationErrors(['JSON 格式错误: ' + (error as Error).message]);
      return false;
    }
  }, [notifyConfigChange]);

  const resetConfig = useCallback(() => {
    setIsUpdating(true);
    console.log('useConfigManager: resetConfig called');

    const defaultJsonString = JSON.stringify(defaultConfig, null, 2);

    // ✅ 修复：直接按顺序更新状态，确保同步
    setConfig(defaultConfig);
    setJsonConfig(defaultJsonString);
    setChartType("line");
    setValidationErrors([]);
    setIsUpdating(false);
    console.log('useConfigManager: all states reset to default');
    console.log('useConfigManager: config title reset to:', defaultConfig.title.text);

    // ✅ 同步通知所有监听器
    setTimeout(() => {
      notifyConfigChange();
      console.log('useConfigManager: listeners notified of reset');
    }, 0);
  }, [notifyConfigChange]);

  const exportConfig = useCallback(() => {
    return jsonConfig;
  }, [jsonConfig]);

  const importConfig = useCallback(
    (configString: string) => {
      return updateConfigFromJson(configString);
    },
    [updateConfigFromJson],
  );

  // 获取配置摘要（用于性能优化）
  const getConfigSummary = useCallback(() => {
    return {
      title: config.title.text,
      seriesCount: config.series.length,
      chartType,
      lastUpdate: Date.now()
    };
  }, [config.title.text, config.series.length, chartType]);

  // 清理防抖定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    config,
    chartType,
    jsonConfig,
    validationErrors,
    isUpdating,
    updateConfig,
    updateSeriesType,
    updateSeriesData,
    updateConfigFromJson,
    resetConfig,
    exportConfig,
    importConfig,
    addConfigChangeListener,
    getConfigSummary,
    validateConfig: () => validateConfig(config),
  };
};
