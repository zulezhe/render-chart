import React, { useState, useEffect } from 'react';
import { Code, Download, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CodeEditor } from './CodeEditor';
import { useConfigManager } from '../hooks/useConfigManager';
import { formatJSON, validateJSON } from '../lib/utils';

interface ConfigEditorProps {
  onConfigChange: () => void;
}

export const ConfigEditor: React.FC<ConfigEditorProps> = ({ onConfigChange }) => {
  const { jsonConfig, updateConfigFromJson, resetConfig } = useConfigManager();
  const [localConfig, setLocalConfig] = useState(jsonConfig);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setLocalConfig(jsonConfig);
  }, [jsonConfig]);

  const handleConfigChange = (value: string) => {
    setLocalConfig(value);
    const isValidJson = validateJSON(value);
    setIsValid(isValidJson);

    // 实时预览：当JSON格式正确时自动应用配置
    if (isValidJson) {
      try {
        updateConfigFromJson(value);
        onConfigChange();
      } catch (error) {
        console.warn('Failed to parse JSON for preview:', error);
      }
    }
  };

  const applyConfig = () => {
    if (isValid && updateConfigFromJson(localConfig)) {
      onConfigChange();
    }
  };

  const formatConfig = () => {
    const formatted = formatJSON(localConfig);
    setLocalConfig(formatted);
    setIsValid(validateJSON(formatted));
  };

  const resetToDefault = () => {
    resetConfig();
    onConfigChange();
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
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={formatConfig}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            格式化
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
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
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 p-4 min-h-0 overflow-hidden">
          <CodeEditor
            value={localConfig}
            onChange={handleConfigChange}
            placeholder="在此输入JSON配置..."
            isValid={isValid}
            className="h-full border-0"
            showLineNumbers={true}
            minHeight="100%"
          />
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
              {isValid ? '✓ JSON格式正确' : '✗ JSON格式错误'}
            </div>
            <Button
              onClick={applyConfig}
              disabled={!isValid}
              className="px-6"
            >
              应用配置
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};