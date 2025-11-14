import React, { createContext, useContext, useCallback, useRef, useEffect, useState } from 'react';
import { useConfigManager } from '../hooks/useConfigManager';

interface ConfigContextType {
  config: any;
  updateConfig: (updates: any) => void;
  isUpdating: boolean;
  validationErrors: string[];
  refreshChart: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfigContext = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigProvider');
  }
  return context;
};

interface ConfigProviderProps {
  children: React.ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const {
    config,
    updateConfig,
    isUpdating,
    validationErrors,
    addConfigChangeListener
  } = useConfigManager();

  const refreshCallbacks = useRef<Set<() => void>>(new Set());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 添加图表刷新回调
  const addRefreshCallback = useCallback((callback: () => void) => {
    refreshCallbacks.current.add(callback);
    return () => {
      refreshCallbacks.current.delete(callback);
    };
  }, []);

  // 触发所有图表刷新
  const refreshChart = useCallback(() => {
    refreshCallbacks.current.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in refresh callback:', error);
      }
    });
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // 使用配置变化监听器
  useEffect(() => {
    const unsubscribe = addConfigChangeListener(() => {
      // 延迟刷新，避免频繁更新
      setTimeout(() => {
        refreshChart();
      }, 50);
    });

    return unsubscribe;
  }, [addConfigChangeListener, refreshChart]);

  const contextValue = React.useMemo(() => ({
    config,
    updateConfig,
    isUpdating,
    validationErrors,
    refreshChart,
    addRefreshCallback
  }), [config, updateConfig, isUpdating, validationErrors, refreshChart, addRefreshCallback]);

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};