import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Code, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CodeEditor } from './CodeEditor';
import { useConfigManager } from '../hooks/useConfigManager';
import { formatJSON, validateJSON } from '../lib/utils';

export const ConfigEditor: React.FC = () => {
  const {
    jsonConfig,
    updateConfigFromJson,
    resetConfig,
    validationErrors,
    isUpdating,
    addConfigChangeListener
  } = useConfigManager();

  const [localConfig, setLocalConfig] = useState(jsonConfig);
  const [isValid, setIsValid] = useState(true);
  const [isLocalChange, setIsLocalChange] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // ✅ 优化：添加配置版本控制，避免循环更新
  const configVersionRef = useRef(0);

  // 使用配置变化监听器
  useEffect(() => {
    const unsubscribe = addConfigChangeListener(() => {
      // ✅ 修复：当外部配置变化时，确保本地编辑器同步更新
      if (!isLocalChange) {
        console.log('ConfigEditor: External config change detected, syncing...');
        configVersionRef.current += 1;
        setLocalConfig(jsonConfig);
        setIsValid(true);
      }
    });

    return unsubscribe;
  }, [addConfigChangeListener, jsonConfig]);

  // ✅ 优化：简化同步逻辑，避免重复更新
  useEffect(() => {
    if (!isLocalChange && localConfig !== jsonConfig) {
      console.log('ConfigEditor: Syncing external config to local editor');
      setLocalConfig(jsonConfig);
      const isValidJson = validateJSON(jsonConfig);
      setIsValid(isValidJson);
    }
  }, [jsonConfig, localConfig]);

  // ✅ 修复：优化防抖处理，与useConfigManager协调
  const handleConfigChange = useCallback((value: string) => {
    console.log('ConfigEditor: handleConfigChange called');
    setIsLocalChange(true);
    setLocalConfig(value);
    const isValidJson = validateJSON(value);
    setIsValid(isValidJson);

    // 清除之前的防抖定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // ✅ 修复：实时预览：当JSON格式正确时自动应用配置
    if (isValidJson) {
      debounceTimerRef.current = setTimeout(() => {
        try {
          console.log('ConfigEditor: Applying config from JSON editor');
          const success = updateConfigFromJson(value);
          if (success) {
            // ✅ 优化：使用微任务确保状态更新顺序
            Promise.resolve().then(() => {
              console.log('ConfigEditor: Marking local change as false');
              setIsLocalChange(false);
            });
          } else {
            setIsLocalChange(false);
          }
        } catch (error) {
          console.warn('Failed to parse JSON for preview:', error);
          setIsLocalChange(false);
        }
      }, 100); // ✅ 优化：增加防抖时间，避免与useConfigManager冲突
    } else {
      setIsLocalChange(false);
    }
  }, [updateConfigFromJson]);

  const applyConfig = () => {
    if (isValid && updateConfigFromJson(localConfig)) {
      setIsLocalChange(false);
    }
  };

  const formatConfig = () => {
    const formatted = formatJSON(localConfig);
    setLocalConfig(formatted);
    const isValidJson = validateJSON(formatted);
    setIsValid(isValidJson);
    setIsLocalChange(true);

    if (isValidJson) {
      updateConfigFromJson(formatted);
      setIsLocalChange(false);
    }
  };

  const resetToDefault = () => {
    resetConfig();
    setIsLocalChange(false);
  };

  const exportConfig = () => {
    const blob = new Blob([localConfig], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chart-config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Code className="h-5 w-5 text-blue-600" />
          配置编辑器
          {isUpdating && (
            <div className="animate-spin rounded-full h-4 w-4 border border-blue-600 border-t-transparent"></div>
          )}
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={formatConfig}
            disabled={isUpdating}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            格式化
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
            disabled={isUpdating}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            重置
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportConfig}
          >
            <Download className="h-4 w-4 mr-1" />
            导出
          </Button>
        </div>
      </CardHeader>

      {/* 错误提示 */}
      {validationErrors.length > 0 && (
        <div className="mx-4 mt-2 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">配置错误:</span>
          </div>
          <ul className="mt-2 text-xs text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 p-4 min-h-0 overflow-hidden">
          <CodeEditor
            value={localConfig}
            onChange={handleConfigChange}
            placeholder="在此输入JSON配置..."
            isValid={isValid && validationErrors.length === 0}
            className="h-full border-0"
            showLineNumbers={true}
            minHeight="100%"
          />
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`text-sm ${isValid && validationErrors.length === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {isValid && validationErrors.length === 0 ? '✓ JSON格式正确' : '✗ 配置有错误'}
              </div>
              {isUpdating && (
                <span className="text-xs text-blue-600">正在更新...</span>
              )}
            </div>
            <Button
              onClick={applyConfig}
              disabled={!isValid || validationErrors.length > 0 || isUpdating}
              className="px-6"
            >
              {isUpdating ? '应用中...' : '应用配置'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};