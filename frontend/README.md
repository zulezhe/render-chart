# ECharts 可视化配置平台 - 前端

一个现代化的 React + TypeScript + ECharts 可视化图表配置平台，支持实时预览、配置编辑、导出分享等功能。

## 🚀 功能特性

- **📊 多种图表类型**：支持折线图、柱状图、饼图、散点图、雷达图、仪表盘等
- **🎨 可视化配置**：直观的配置面板，支持实时预览
- **⚡ 实时编辑**：JSON 配置编辑器，支持语法高亮和格式化
- **💾 配置管理**：保存、加载、删除图表配置
- **🔗 分享功能**：生成分享链接，便于协作
- **📥 导出功能**：支持导出为 PNG、JPEG 图片格式
- **🎯 响应式设计**：适配不同屏幕尺寸
- **🌙 现代化 UI**：基于 Tailwind CSS 和 Radix UI

## 🛠️ 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite
- **图表库**: ECharts 6.0
- **样式**: Tailwind CSS + Radix UI
- **状态管理**: React Hooks
- **图标**: Lucide React
- **代码编辑器**: ACE Editor
- **图片导出**: html2canvas

## 📦 项目结构

```
src/
├── components/           # React 组件
│   ├── ui/              # 基础 UI 组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   └── textarea.tsx
│   ├── ChartConfig.tsx  # 图表配置面板
│   ├── ConfigEditor.tsx # 配置编辑器
│   ├── ChartPreview.tsx # 图表预览
│   └── LayoutManager.tsx # 布局管理器
├── hooks/               # 自定义 Hooks
│   ├── useConfigManager.ts
│   └── useEChartsConfig.ts
├── services/            # API 服务
│   ├── api.ts
│   └── chart-templates.ts
├── types/               # TypeScript 类型定义
│   └── chart.ts
├── lib/                 # 工具函数
│   └── utils.ts
├── App.tsx              # 主应用组件
├── main.tsx             # 应用入口
└── index.css            # 全局样式
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 环境配置

复制环境变量示例文件并根据需要修改：

```bash
cp src/.env.example .env
```

环境变量说明：

```env
# API 配置
VITE_API_BASE_URL=http://localhost:3000/api

# 图表配置
VITE_DEFAULT_CHART_WIDTH=800
VITE_DEFAULT_CHART_HEIGHT=600
VITE_EXPORT_IMAGE_QUALITY=0.9

# 功能开关
VITE_ENABLE_SHARING=true
VITE_ENABLE_TEMPLATES=true
VITE_ENABLE_EXPORT=true
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 http://localhost:5173 查看应用。

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建文件将输出到 `dist/` 目录。

### 预览生产版本

```bash
npm run preview
# 或
yarn preview
```

## 🎯 核心功能使用

### 1. 图表配置

- 选择图表类型（折线图、柱状图、饼图等）
- 配置基础信息（标题、轴名称、数据等）
- 调整样式（颜色、字体、边距等）
- 设置动画效果

### 2. 配置编辑器

- 实时 JSON 编辑
- 语法高亮
- 格式化功能
- 错误提示

### 3. 图表预览

- 实时预览配置效果
- 交互模式切换
- 导出图片（PNG、JPEG）
- 生成分享链接

### 4. 配置管理

- 保存配置到服务器
- 加载已保存的配置
- 删除配置
- 复制配置

## 🔧 开发指南

### 添加新的图表类型

1. 在 `src/types/chart.ts` 中添加新的图表类型定义
2. 在 `src/components/ChartConfig.tsx` 中添加对应的配置选项
3. 在 `src/services/chart-templates.ts` 中添加默认模板

### 自定义 UI 组件

基础 UI 组件位于 `src/components/ui/`，基于 Radix UI 构建。可以扩展现有组件或添加新的组件。

### API 集成

API 服务封装在 `src/services/api.ts` 中，包含以下功能：

- 配置的 CRUD 操作
- 分享链接生成
- 图片导出
- 文件上传
- 配置验证

## 🧪 测试

```bash
# 运行 ESLint 检查
npm run lint

# 运行类型检查
npm run type-check
```

## 📝 代码规范

- 使用 TypeScript 进行类型安全
- 遵循 ESLint 代码规范
- 使用 Prettier 进行代码格式化
- 组件使用函数式组件和 Hooks
- 使用 Tailwind CSS 进行样式开发

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## 🆘 支持

如果遇到问题或有建议，请：

1. 查看 Issues 页面
2. 创建新的 Issue
3. 联系项目维护者

## 🙏 致谢

- [ECharts](https://echarts.apache.org/) - 强大的图表库
- [React](https://reactjs.org/) - 用户界面库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Radix UI](https://www.radix-ui.com/) - 无障碍 UI 组件
- [Vite](https://vitejs.dev/) - 快速构建工具
