import React, { useState } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { BarChart3, Save, Share, Download, GripVertical, Settings, Edit3, FileText, Layout } from 'lucide-react';
import { ChartConfig } from './ChartConfig';
import { ConfigEditor } from './ConfigEditor';
import { ChartPreviewSplit } from './ChartPreviewSplit';
import { Button } from './ui/button';
import { useConfigManager } from '../hooks/useConfigManager';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { copyToClipboard, downloadFile } from '../lib/utils';
import { ConfigDebug } from './ConfigDebug';

export const LayoutManager: React.FC = () => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'split' | 'code' | 'preview'>('split');
  const [debugMode, setDebugMode] = useState(true); // ✅ 临时启用调试模式进行测试
  const { exportConfig, resetConfig, addConfigChangeListener } = useConfigManager();

  
  const handleSaveConfig = () => {
    const config = exportConfig();
    // 这里可以调用API保存配置到服务器
    console.log('Saving config to server...');
    localStorage.setItem('chart-config', config);
    alert('配置已保存到本地');
  };

  const handleExportConfig = () => {
    const config = exportConfig();
    downloadFile(config, 'chart-config.json', 'application/json');
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleCopyShareLink = async () => {
    const shareUrl = window.location.href;
    const success = await copyToClipboard(shareUrl);
    if (success) {
      alert('分享链接已复制到剪贴板');
    }
  };

  const handleReset = () => {
    if (confirm('确定要重置所有配置吗？')) {
      resetConfig();
    }
  };

  const exportChart = (format: 'png' | 'jpeg') => {
    // 这个方法会在ChartPreview中被实际调用
    console.log(`Exporting chart as ${format}`);
  };

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* 顶部导航栏 */}
      <header className="bg-card border-b shadow-sm flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">ECharts 配置平台</h1>
          </div>

          <div className="flex items-center space-x-3">
            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)} className="w-auto mr-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="split" className="flex items-center space-x-1">
                  <Layout className="h-4 w-4" />
                  <span>分屏</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>代码</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center space-x-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>预览</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button onClick={handleSaveConfig}>
              <Save className="h-4 w-4 mr-2" />
              保存配置
            </Button>
            <Button variant="outline" onClick={handleExportConfig}>
              <Download className="h-4 w-4 mr-2" />
              导出配置
            </Button>
            <Button
              variant="outline"
              onClick={() => setDebugMode(!debugMode)}
              className={debugMode ? 'bg-blue-50 border-blue-200' : ''}
            >
              {debugMode ? '🐛 调试中' : '🐛 调试'}
            </Button>

            <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={handleShare}>
                  <Share className="h-4 w-4 mr-2" />
                  分享
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>分享图表配置</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="share-url">分享链接</Label>
                    <div className="flex gap-2">
                      <Input
                        id="share-url"
                        value={window.location.href}
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={handleCopyShareLink}
                      >
                        复制
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    点击复制按钮将分享链接复制到剪贴板，然后分享给其他人查看您的图表配置。
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* 主内容区 - 使用可调整大小的面板 */}
      <main className="flex-1 min-h-0">
        {activeView === 'split' && (
          <PanelGroup direction="horizontal" className="h-full">
            {/* 左侧基础设置面板 - 20% */}
            <Panel defaultSize={20} minSize={15} maxSize={30}>
              <div className="h-full bg-card border-r overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h2 className="font-semibold text-foreground flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>基础设置</span>
                  </h2>
                </div>
                <div className="h-[calc(100%-60px)] overflow-y-auto p-4">
                  <ChartConfig />
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="w-1 bg-border hover:bg-muted-foreground/20 transition-colors cursor-col-resize group">
              <div className="h-full flex items-center justify-center">
                <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground/80" />
              </div>
            </PanelResizeHandle>

            {/* 中间配置编辑器面板 - 可拖拽调整 */}
            <Panel defaultSize={40} minSize={25} maxSize={50}>
              <div className="h-full bg-card border-r overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h2 className="font-semibold text-foreground flex items-center space-x-2">
                    <Edit3 className="h-4 w-4" />
                    <span>配置编辑器</span>
                  </h2>
                </div>
                <div className="h-[calc(100%-60px)] overflow-y-auto p-4">
                  <ConfigEditor />
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="w-1 bg-border hover:bg-muted-foreground/20 transition-colors cursor-col-resize group">
              <div className="h-full flex items-center justify-center">
                <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground/80" />
              </div>
            </PanelResizeHandle>

            {/* 右侧图表预览面板 - 剩余空间 */}
            <Panel defaultSize={40} minSize={30}>
              <div className="h-full bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h2 className="font-semibold text-foreground flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>图表预览</span>
                  </h2>
                </div>
                <div className="h-[calc(100%-60px)] overflow-hidden p-4">
                  <ChartPreviewSplit
                    exportChart={exportChart}
                    onShare={handleShare}
                  />
                </div>
              </div>
            </Panel>
          </PanelGroup>
        )}

        {activeView === 'code' && (
          <PanelGroup direction="horizontal" className="h-full">
            {/* 左侧基础设置面板 - 20% */}
            <Panel defaultSize={20} minSize={15} maxSize={30}>
              <div className="h-full bg-card border-r overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h2 className="font-semibold text-foreground flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>基础设置</span>
                  </h2>
                </div>
                <div className="h-[calc(100%-60px)] overflow-y-auto p-4">
                  <ChartConfig />
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="w-1 bg-border hover:bg-muted-foreground/20 transition-colors cursor-col-resize group">
              <div className="h-full flex items-center justify-center">
                <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground/80" />
              </div>
            </PanelResizeHandle>

            {/* 右侧代码编辑器面板 - 80% */}
            <Panel defaultSize={80} minSize={50}>
              <div className="h-full bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h2 className="font-semibold text-foreground flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>配置代码</span>
                  </h2>
                </div>
                <div className="h-[calc(100%-60px)] overflow-y-auto p-4">
                  <ConfigEditor />
                </div>
              </div>
            </Panel>
          </PanelGroup>
        )}

        {activeView === 'preview' && (
          <PanelGroup direction="horizontal" className="h-full">
            {/* 左侧基础设置面板 - 20% */}
            <Panel defaultSize={20} minSize={15} maxSize={30}>
              <div className="h-full bg-card border-r overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h2 className="font-semibold text-foreground flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>基础设置</span>
                  </h2>
                </div>
                <div className="h-[calc(100%-60px)] overflow-y-auto p-4">
                  <ChartConfig />
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="w-1 bg-border hover:bg-muted-foreground/20 transition-colors cursor-col-resize group">
              <div className="h-full flex items-center justify-center">
                <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground/80" />
              </div>
            </PanelResizeHandle>

            {/* 右侧图表预览面板 - 80% */}
            <Panel defaultSize={80} minSize={50}>
              <div className="h-full bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h2 className="font-semibold text-foreground flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>图表预览</span>
                  </h2>
                </div>
                <div className="h-[calc(100%-60px)] overflow-hidden p-4">
                  <ChartPreviewSplit
                    exportChart={exportChart}
                    onShare={handleShare}
                  />
                </div>
              </div>
            </Panel>
          </PanelGroup>
        )}
      </main>

      {/* 调试信息 */}
      <ConfigDebug enabled={debugMode} />
    </div>
  );
};