import React, { useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isValid?: boolean;
  className?: string;
  showLineNumbers?: boolean;
  minHeight?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  placeholder = '在此输入JSON配置...',
  isValid = true,
  className,
  showLineNumbers = true,
  minHeight = '400px'
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;

    // 配置JSON语言支持
    monaco.languages.setMonarchTokensProvider('json', {
      tokenizer: {
        root: [
          [/[{}]/, 'delimiter.bracket'],
          [/\[[\]]/, 'delimiter.array'],
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string_double'],
          [/[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?/, 'number'],
          [/[,:]/, 'delimiter'],
          [/[ \t\r\n]+/, 'white'],
          [/\/.*$/, 'comment'],
        ],
        string_double: [
          [/[^\\"]+/, 'string'],
          [/\\./, 'string.escape'],
          [/"/, 'string', '@pop'],
        ],
      },
    });

    // 配置编辑器选项
    editor.updateOptions({
      minimap: { enabled: false },
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'always',
      lineNumbers: showLineNumbers ? 'on' : 'off',
      glyphMargin: true,
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 3,
      fontSize: 14,
      fontFamily: '"Fira Code", "Fira Mono", "Consolas", "Monaco", "Courier New", monospace',
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true
      },
      suggest: {
        showKeywords: false,
        showSnippets: false
      }
    });

    // 添加验证错误标记
    if (!isValid) {
      const model = editor.getModel();
      if (model) {
        monaco.editor.setModelMarkers(model, 'json', [{
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: model.getLineCount(),
          endColumn: model.getLineMaxColumn(model.getLineCount()),
          message: 'JSON格式错误',
          severity: monaco.MarkerSeverity.Error
        }]);
      }
    }
  }, [showLineNumbers, isValid]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  }, [onChange]);

  // 配置Monaco Editor的主题 - 使用默认浅色主题
  const handleEditorWillMount = useCallback((monaco: any) => {
    // 使用默认的vs（浅色）主题，不定义自定义主题
    // 这样可以保持与系统主题一致，为后续的换肤功能留出空间
  }, []);

  return (
    <div className={cn('relative border rounded-md overflow-hidden h-full flex flex-col', className)}>
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="json"
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          beforeMount={handleEditorWillMount}
          theme="vs"
          options={{
            selectOnLineNumbers: true,
            automaticLayout: true,
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            minimap: { enabled: false },
            lineNumbers: showLineNumbers ? 'on' : 'off',
            glyphMargin: true,
            fontSize: 14,
            fontFamily: '"Fira Code", "Fira Mono", "Consolas", "Monaco", "Courier New", monospace',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true
            },
            padding: { top: 12, bottom: 12 },
            suggest: {
              showKeywords: false,
              showSnippets: false
            }
          }}
          loading={<div className="flex items-center justify-center h-full">
            <span className="text-sm text-muted-foreground">加载编辑器...</span>
          </div>}
        />
      </div>

      {!isValid && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl z-20">
          JSON格式错误
        </div>
      )}
    </div>
  );
};