import { useRef, useEffect, useCallback } from 'react';
import * as echarts from 'echarts';
import { ChartConfig } from '../types/chart';

export const useEChartsConfig = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // 创建图表实例
  const createChart = useCallback(() => {
    if (chartRef.current && !chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);

      // 设置ResizeObserver来监听容器大小变化
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserverRef.current = new ResizeObserver((entries) => {
          for (const entry of entries) {
            if (entry.target === chartRef.current) {
              chartInstanceRef.current?.resize();
            }
          }
        });

        resizeObserverRef.current.observe(chartRef.current);
      }

      return chartInstanceRef.current;
    }
    return null;
  }, []);

  // 初始化图表
  useEffect(() => {
    const chart = createChart();

    // 同时保留窗口大小变化的监听作为备用
    const handleWindowResize = () => {
      chartInstanceRef.current?.resize();
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);

      // 清理ResizeObserver
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }

      // 销毁图表实例
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, [createChart]);

  const updateChart = useCallback((config: ChartConfig) => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.setOption(config as any, true);
    }
  }, []);

  const exportImage = useCallback((type: 'png' | 'jpeg' = 'png', pixelRatio = 2): string => {
    if (chartInstanceRef.current) {
      return chartInstanceRef.current.getDataURL({
        type,
        pixelRatio,
        backgroundColor: '#fff'
      });
    }
    return '';
  }, []);

  const showLoading = useCallback(() => {
    chartInstanceRef.current?.showLoading();
  }, []);

  const hideLoading = useCallback(() => {
    chartInstanceRef.current?.hideLoading();
  }, []);

  // 手动触发resize的方法
  const manualResize = useCallback(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.resize();
    }
  }, []);

  return {
    chartRef,
    updateChart,
    exportImage,
    showLoading,
    hideLoading,
    manualResize,
    chartInstance: chartInstanceRef.current
  };
};