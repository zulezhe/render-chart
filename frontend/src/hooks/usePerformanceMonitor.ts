import React, { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  totalRenderTime: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const renderCountRef = useRef(0);
  const renderTimesRef = useRef<number[]>([]);
  const lastRenderStartRef = useRef<number>(0);

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    totalRenderTime: 0,
  });

  useEffect(() => {
    // 组件开始渲染的时间
    lastRenderStartRef.current = performance.now();

    // 使用 requestAnimationFrame 来测量渲染完成时间
    const rafId = requestAnimationFrame(() => {
      const renderTime = performance.now() - lastRenderStartRef.current;

      renderCountRef.current += 1;
      renderTimesRef.current.push(renderTime);

      // 只保留最近50次渲染的数据
      if (renderTimesRef.current.length > 50) {
        renderTimesRef.current = renderTimesRef.current.slice(-50);
      }

      const totalRenderTime = renderTimesRef.current.reduce((sum, time) => sum + time, 0);
      const averageRenderTime = totalRenderTime / renderTimesRef.current.length;

      setMetrics({
        renderCount: renderCountRef.current,
        lastRenderTime: renderTime,
        averageRenderTime,
        totalRenderTime,
      });

      // 在开发环境中输出性能警告
      if (import.meta.env.DEV) {
        if (renderTime > 16) { // 超过一帧的时间
          console.warn(`🐌 [${componentName}] Slow render detected: ${renderTime.toFixed(2)}ms`);
        }
        if (renderCountRef.current % 100 === 0) {
          console.log(`📊 [${componentName}] Performance stats:`, {
            renders: renderCountRef.current,
            avgTime: averageRenderTime.toFixed(2) + 'ms',
            lastTime: renderTime.toFixed(2) + 'ms',
          });
        }
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  });

  return metrics;
};

// 性能监控的Context
export const PerformanceContext = React.createContext<{
  metrics: Record<string, PerformanceMetrics>;
  registerComponent: (name: string) => void;
}>({
  metrics: {},
  registerComponent: () => {},
});

export const usePerformanceContext = () => {
  const context = React.useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformanceContext must be used within PerformanceProvider');
  }
  return context;
};