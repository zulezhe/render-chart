/*
 * @Author: oliver
 * @Date: 2025-11-10 17:27:15
 * @LastEditors: oliver
 * @LastEditTime: 2025-11-11 16:58:38
 * @Description: Vite配置优化 - 包含代码分割、路径别名、开发服务器和构建优化
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'fs'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 读取package.json获取版本号
const packageJson = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // 路径别名增强 - 添加更完善的路径别名配置
  resolve: {
    alias: [
      // 基础路径别名
      {
        find: '@',
        replacement: path.resolve(__dirname, './src')
      },
      // 组件相关路径别名
      {
        find: '@/components',
        replacement: path.resolve(__dirname, './src/components')
      },
      {
        find: '@/ui',
        replacement: path.resolve(__dirname, './src/components/ui')
      },
      // 工具和类型路径别名
      {
        find: '@/lib',
        replacement: path.resolve(__dirname, './src/lib')
      },
      {
        find: '@/hooks',
        replacement: path.resolve(__dirname, './src/hooks')
      },
      {
        find: '@/types',
        replacement: path.resolve(__dirname, './src/types')
      },
      {
        find: '@/assets',
        replacement: path.resolve(__dirname, './src/assets')
      }
    ],
    // 扩展名自动补全 - 减少导入时需要写扩展名的情况
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  
  // 代码分割优化 - 将React、ECharts和工具库分离
  build: {
    // 生产环境sourcemap - 便于调试
    sourcemap: true,
    
    // 构建性能相关配置
    target: 'es2015', // 设置构建目标，支持现代浏览器
    
    // 输出配置优化
    outDir: 'dist',
    assetsDir: 'assets',
    
    // chunk大小警告限制 - 设置合理的警告阈值
    chunkSizeWarningLimit: 1000,
    
    // 代码分割策略 - 手动配置chunk分割
    rollupOptions: {
      output: {
        // 手动分割第三方库
        manualChunks: {
          // React相关库单独打包
          'react-vendor': ['react', 'react-dom'],
          
          // ECharts相关库单独打包
          'echarts-vendor': ['echarts'],
          
          // UI组件库单独打包
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs'
          ],
          
          // 工具库单独打包
          'utils-vendor': [
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
            'lucide-react',
            'html2canvas'
          ]
        },
        
        // 文件命名策略 - 便于缓存管理
        chunkFileNames: () => {
          // 为不同类型的chunk设置不同的命名模式
          return `js/[name]-[hash].js`
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // 根据资源类型分类存放
          if (!assetInfo.name) return `assets/[name]-[hash][extname]`
          
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
            return `media/[name]-[hash][extname]`
          }
          if (/\.(png|jpe?g|gif|svg|webp|avif)(\?.*)?$/i.test(assetInfo.name)) {
            return `images/[name]-[hash][extname]`
          }
          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        }
      }
    },
    
    // 压缩配置 - 使用默认压缩器
    minify: true
  },
  
  // 开发服务器优化
  server: {
    // 开发服务器端口
    port: 3000,
    
    // 自动打开浏览器
    open: true,
    
    // API代理配置 - 解决开发环境跨域问题
    proxy: {
      // 代理后端API请求
      '/api': {
        target: 'http://localhost:3000', // 后端服务地址
        changeOrigin: true, // 改变请求源
        secure: false, // 如果是https接口，需要配置这个参数
        ws: true, // 支持websocket
        // 可选：路径重写
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      
      // 代理ECharts渲染服务
      '/render': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    },
    
    // 优化开发服务器设置
    fs: {
      // 开发时允许访问的目录
      strict: false
    },
    
    // HMR优化
    hmr: {
      overlay: true // 显示错误覆盖层
    }
  },
  
  // 预览服务器配置
  preview: {
    port: 4173,
    open: true
  },
  
  // 依赖优化
  optimizeDeps: {
    // 预构建包含的依赖
    include: [
      'react',
      'react-dom',
      'echarts',
      'html2canvas',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-label',
      '@radix-ui/react-select',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      'class-variance-authority',
      'clsx',
      'tailwind-merge'
    ],
    
    // 排除预构建的依赖
    exclude: []
  },
  
  // 环境变量配置
  define: {
    // 定义全局常量
    __APP_VERSION__: JSON.stringify(packageJson.version || '1.0.0')
  },
  
  // CSS配置
  css: {
    // CSS模块化配置
    modules: {
      localsConvention: 'camelCase'
    },
    
    // PostCSS配置
    postcss: {
      plugins: [
        // 可以在这里添加额外的PostCSS插件
      ]
    }
  }
})
